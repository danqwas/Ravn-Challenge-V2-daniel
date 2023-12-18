/*
  Warnings:

  - You are about to drop the column `cartId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `TokenBlacklist` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `Cart` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `cart_id` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `productId` on the `CartItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `product_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderId` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `product_id` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TokenBlacklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "cartId",
ADD COLUMN     "cart_id" UUID NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "productId",
DROP COLUMN "userId",
ADD COLUMN     "product_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "orderId",
ADD COLUMN     "orderId" UUID NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "productId",
ADD COLUMN     "product_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "TokenBlacklist" ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenBlacklist_token_key" ON "TokenBlacklist"("token");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenBlacklist" ADD CONSTRAINT "TokenBlacklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
