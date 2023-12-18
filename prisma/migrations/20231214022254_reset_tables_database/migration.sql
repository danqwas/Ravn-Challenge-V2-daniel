-- CreateTable
CREATE TABLE "TokenBlacklist" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenBlacklist_pkey" PRIMARY KEY ("id")
);

-- Drop the foreign key constraints on ProductImage, Like, CartItem, and OrderItem first
ALTER TABLE "ProductImage" DROP CONSTRAINT IF EXISTS "ProductImage_productId_fkey";
ALTER TABLE "Like" DROP CONSTRAINT IF EXISTS "Like_productId_fkey";
ALTER TABLE "CartItem" DROP CONSTRAINT IF EXISTS"CartItem_productId_fkey";
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS"OrderItem_productId_fkey";
ALTER TABLE "CartItem" DROP CONSTRAINT IF EXISTS "CartItem_cartId_fkey";
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS"OrderItem_orderId_fkey";
ALTER TABLE "Like" DROP CONSTRAINT IF EXISTS "Like_userId_fkey";
ALTER TABLE "Cart" DROP CONSTRAINT IF EXISTS "Cart_userId_fkey";
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_userId_fkey";

-- AlterTable for Cart
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
  DROP COLUMN "id",
  ADD COLUMN "id" UUID NOT NULL,
  ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("id");

-- AlterTable for CartItem
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_pkey",
  DROP COLUMN "id",
  ADD COLUMN "id" UUID NOT NULL,
  ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id");

-- AlterTable for Like
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
  DROP COLUMN "id",
  ADD COLUMN "id" UUID NOT NULL,
  ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");

-- AlterTable for Order
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
  DROP COLUMN "id",
  ADD COLUMN "id" UUID NOT NULL,
  ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable for OrderItem
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
  DROP COLUMN "id",
  ADD COLUMN "id" UUID NOT NULL,
  ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");

-- AlterTable for Product
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
  DROP COLUMN "id",
  ADD COLUMN "id" UUID NOT NULL,
  ALTER COLUMN "isVisible" SET DEFAULT true,
  ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable for ProductImage
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_pkey",
  DROP COLUMN "id",
  ADD COLUMN "id" UUID NOT NULL,
  ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id");

-- AlterTable for User
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
  DROP COLUMN "id",
  ADD COLUMN "id" UUID NOT NULL,
  ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
