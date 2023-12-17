import { Auth, GetUser } from 'src/auth/decorators';

import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';

import { LikesService } from './likes.service';

@ApiTags('Likes')
@Controller({
  path: '',
  version: '1',
})
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('likes/products/:id')
  @Auth(UserRole.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a product' })
  likeAProduct(@Param('id') id: string, @GetUser() user: User) {
    console.log(
      '🚀 ~ file: likes.controller.ts:32 ~ LikesController ~ productId:',
      id,
    );
    return this.likesService.likeAProduct(user, id);
  }

  @Get('products/:productId/likes')
  findTotalLikes(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.likesService.findTotalLikes(productId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth(UserRole.CLIENT)
  @ApiOperation({ summary: 'Unlike a product' })
  unLikeAProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.likesService.remove(id, user);
  }
}
