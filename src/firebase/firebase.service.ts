import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'fs';
import { promisify } from 'util';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private readdir = promisify(fs.readdir);
  private unlink = promisify(fs.unlink);
  private app: admin.app.App;

  constructor(private configService: ConfigService) {
    const privateKey = configService
      .get('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n');
    const projectId = configService.get('FIREBASE_PROJECT_ID');
    const clientEmail = configService.get('FIREBASE_CLIENT_EMAIL');
    const storageBucket = configService.get('FIREBASE_STORAGE_BUCKET');

    this.app = admin.initializeApp(
      {
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey,
        }),
        projectId: projectId,
        storageBucket: storageBucket,
      },
      'default',
    );
  }

  async upload(file: Express.Multer.File) {
    const FIREBASE_STORAGE_BUCKET = this.configService.get(
      'FIREBASE_STORAGE_BUCKET',
    );
    const FIREBASE_PROJECT_ID = this.configService.get('FIREBASE_PROJECT_ID');
    try {
      const bucket = getStorage(this.app).bucket(FIREBASE_STORAGE_BUCKET);
      const destination = `products/${file.filename}`;

      await bucket.upload(file.path, {
        destination,
        metadata: { contentType: file.mimetype },
        public: true,
        userProject: FIREBASE_PROJECT_ID,
      });

      await bucket.file(destination).makePublic();

      const url = `https://storage.googleapis.com/${FIREBASE_STORAGE_BUCKET}/${destination}`;

      const files = await this.readdir('./static/products');
      const path = './static/products';

      await Promise.all(files.map((file) => this.unlink(`${path}/${file}`)));

      return url;
    } catch (error) {
      console.error(error);
      throw error; // Propagate the error after logging
    }
  }
  async delete(fileName: string) {
    // the fileName is the  url of the image i need the name

    const FIREBASE_STORAGE_BUCKET = this.configService.get(
      'FIREBASE_STORAGE_BUCKET',
    );
    const bucket = getStorage(this.app).bucket(FIREBASE_STORAGE_BUCKET);

    const destination = `products/${fileName}`;

    await bucket.file(destination).delete();

    return true;
  }
}
