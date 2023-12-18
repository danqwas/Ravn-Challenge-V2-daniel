import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateCartItemDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(
    private prismaService: PrismaService,
    private productsService: ProductsService,
  ) {}

  /**
   * Creates a new cart item for a user.
   *
   * @param {CreateCartItemDto} createCartItemDto - The data for creating the cart item.
   * @param {User} user - The user for whom the cart item is being created.
   * @return {Promise<CartItem>} The newly created cart item.
   */
  async create(createCartItemDto: CreateCartItemDto, user: User) {
    const cart = await this.isCartExisting(user.id);
    const { productId, quantity } = createCartItemDto;
    const product = await this.productsService.getAvailableProductById(
      productId,
    );
    const existingCartItem = await this.prismaService.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        productId: product.id,
      },
    });
    if (existingCartItem) {
      return await this.prismaService.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    }
    return await this.prismaService.cartItem.create({
      data: {
        cart: { connect: { id: cart.id } },
        product: { connect: { id: product.id } },
        quantity,
      },
    });
  }

  /**
   * Retrieves the cart items for a specific user, based on the provided pagination query.
   *
   * @param {PaginationQueryDto} paginationQueryDto - The pagination query parameters.
   * @param {User} user - The user for whom to retrieve the cart items.
   * @return {Promise<{ cartItems: CartItem[], totalPrice: string }>} - The cart items and total price.
   */
  async getUserCartItems(user: User) {
    const cart = await this.isCartExisting(user.id);

    const cartItems = await this.prismaService.cartItem.findMany({
      where: { cart_id: cart.id },
      include: {
        product: true,
      },
    });

    const totalPrice = cartItems
      .reduce(
        (total, cartItem) => total + cartItem.quantity * cartItem.product.price,
        0,
      )
      .toPrecision(4);

    const enhancedCartItems = cartItems.map((cartItem) => ({
      ...cartItem,
      product: {
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
        category: cartItem.product.category,
        stock: cartItem.product.stock,
      },
      totalPrice: (cartItem.quantity * cartItem.product.price).toPrecision(4),
    }));

    return {
      cartItems: enhancedCartItems,
      totalPrice,
    };
  }

  /**
   * Finds a cart item by its ID.
   *
   * @param {string} id - The ID of the cart item.
   * @return {Promise<Object>} An object representing the cart item, including the product information and total price.
   * @throws {NotFoundException} If the cart item is not found.
   */
  async findACartItem(id: string, user: User) {
    const cartItem = await this.prismaService.cartItem.findUnique({
      where: { id, cart: { userId: user.id } },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found with this id' + id);
    }
    return {
      ...cartItem,
      product: {
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
      },
      totalPrice: (cartItem.quantity * cartItem.product.price).toPrecision(4),
    };
  }

  /**
   * Updates an item in the cart.
   *
   * @param {string} cartItemId - The ID of the cart item to update.
   * @param {UpdateCartItemDto} updateCartItemDto - The data to update the cart item with.
   * @param {User} user - The user performing the update.
   * @return {Promise<{...updatedCartItem, product: {name: string, description: string, price: number}, totalPrice: string}>} - The updated cart item with the product details and the total price.
   */
  async updateAnCartItem(
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
    user: User,
  ) {
    const cartItem = await this.findACartItem(cartItemId, user);

    await this.productsService.getAvailableProductById(cartItem.productId);

    const updatedCartItem = await this.prismaService.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: updateCartItemDto.quantity,
      },
      include: {
        product: true,
      },
    });

    return {
      ...updatedCartItem,
      product: {
        name: updatedCartItem.product.name,
        description: updatedCartItem.product.description,
        price: updatedCartItem.product.price,
      },
      totalPrice: (
        updatedCartItem.quantity * updatedCartItem.product.price
      ).toPrecision(4),
    };
  }

  /**
   * Removes a cart item.
   *
   * @param {string} cartItemId - The ID of the cart item to be removed.
   * @param {User} user - The user performing the action.
   * @return {Promise<void>} A Promise that resolves when the cart item is successfully removed.
   */
  async removeACartItem(cartItemId: string, user: User) {
    const cartItem = await this.findACartItem(cartItemId, user);

    return await this.prismaService.cartItem.delete({
      where: { id: cartItem.id },
    });
  }

  /**
   * Retrieves the cart for a given user ID.
   *
   * @param {string} userId - The ID of the user.
   * @return {Promise<Cart>} A promise that resolves to the cart object.
   */
  async isCartExisting(userId: string): Promise<Cart> {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: {
        cardItems: true,
        user: true,
      },
    });

    if (!cart) {
      return await this.prismaService.cart.create({
        data: {
          user: { connect: { id: userId } },
        },
        include: {
          cardItems: true,
          user: true,
        },
      });
    }

    return cart;
  }
}
