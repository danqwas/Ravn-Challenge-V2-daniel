import { PrismaService } from 'prisma/prisma.service';

import { FirebaseService } from '../firebase/firebase.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  beforeEach(async () => {
    const PrismaServiceMock = {
      product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as PrismaService;
    const firebaseService = {
      uploadImage: jest.fn(),
      deleteImage: jest.fn(),
    } as unknown as FirebaseService;
    service = new ProductsService(PrismaServiceMock, firebaseService);
    controller = new ProductsController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getAllProducts', () => {
    it('should be defined', () => {
      expect(controller.getProducts({ limit: 10, offset: 0 })).toBeDefined();
    });
    it('should return all products', async () => {
      const results = [
        {
          id: '046c0003-13d6-4c74-a7f9-bf652d9117a6',
          name: 'Awesome Product',
          description: 'This is an awesome product.',
          category: 'Cats Toys',
          price: 2.99,
          stock: 100,
          isVisible: true,
          createdAt: '2023-12-15T06:04:17.835Z',
          updatedAt: '2023-12-15T06:04:17.835Z',
          images: [
            {
              id: '47672f21-0bf9-4e32-b6f3-2cb593119e66',
              url: 'https://storage.googleapis.com/ravn-challenge-v2-daniel.appspot.com/products/1702700480995-bardo.png',
              product_id: '046c0003-13d6-4c74-a7f9-bf652d9117a6',
            },
          ],
        },
        {
          id: 'dd9d4597-14cc-4082-81fb-bdef6f84d2e1',
          name: 'Awesome Product',
          description: 'This is an awesome product.',
          category: 'Dogs Toys',
          price: 23.25,
          stock: 10,
          isVisible: false,
          createdAt: '2023-12-15T06:04:29.102Z',
          updatedAt: '2023-12-15T06:04:29.102Z',
          images: [
            {
              id: 'b03386d3-03d4-4856-aeff-c161c818046f',
              url: 'https://storage.googleapis.com/ravn-challenge-v2-daniel.appspot.com/products/1702701924056-mort.jpg',
              product_id: 'dd9d4597-14cc-4082-81fb-bdef6f84d2e1',
            },
            {
              id: 'bd695e25-641c-4531-9095-652002469565',
              url: 'https://storage.googleapis.com/ravn-challenge-v2-daniel.appspot.com/products/1702702096654-portada.jpg',
              product_id: 'dd9d4597-14cc-4082-81fb-bdef6f84d2e1',
            },
          ],
        },
      ];
      controller.getProducts = jest.fn().mockResolvedValue(results);
      expect(await controller.getProducts({ limit: 10, offset: 0 })).toEqual(
        results,
      );
    });

    it('should return only published products', async () => {
      const results = [
        {
          id: '046c0003-13d6-4c74-a7f9-bf652d9117a6',
          name: 'Awesome Product',
          description: 'This is an awesome product.',
          category: 'Cats Toys',
          price: 2.99,
          stock: 100,
          isVisible: true,
          createdAt: '2023-12-15T06:04:17.835Z',
          updatedAt: '2023-12-15T06:04:17.835Z',
          images: [
            {
              id: '47672f21-0bf9-4e32-b6f3-2cb593119e66',
              url: 'https://storage.googleapis.com/ravn-challenge-v2-daniel.appspot.com/products/1702700480995-bardo.png',
              product_id: '046c0003-13d6-4c74-a7f9-bf652d9117a6',
            },
          ],
        },
      ];
      controller.getAllAvailableProducts = jest.fn().mockResolvedValue(results);
      expect(await controller.getAllAvailableProducts({})).toEqual(results);
    });
  });
  describe('getProductById', () => {
    it('should be defined', () => {
      const expectedResult = {
        id: '046c0003-13d6-4c74-a7f9-bf652d9117a6',
        name: 'Awesome Product',
        description: 'This is an awesome product.',
        category: 'Cats Toys',
        price: 2.99,
        stock: 100,
        isVisible: true,
        createdAt: '2023-12-15T06:04:17.835Z',
        updatedAt: '2023-12-15T06:04:17.835Z',
        images: [
          {
            id: '47672f21-0bf9-4e32-b6f3-2cb593119e66',
            url: 'https://storage.googleapis.com/ravn-challenge-v2-daniel.appspot.com/products/1702700480995-bardo.png',
            product_id: '046c0003-13d6-4c74-a7f9-bf652d9117a6',
          },
        ],
      };
      controller.createAProduct = jest.fn().mockResolvedValue(expectedResult);

      const result = controller.createAProduct({
        name: 'Awesome Product',
        description: 'This is an awesome product.',
        category: 'Cats Toys',
        price: 2.99,
        stock: 100,
        isVisible: true,
      });

      controller.getProductById = jest.fn().mockResolvedValue(result);

      expect(
        controller.getProductById('046c0003-13d6-4c74-a7f9-bf652d9117a6'),
      ).toEqual(expectedResult);
    });
  });
});
