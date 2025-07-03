import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const statusEnum = pgEnum('status', ['in_stock', 'sold', 'listed', 'pending']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  brand: text('brand'),
  model: text('model'),
  size: text('size'),
  condition: text('condition').notNull().default('new'),
  status: statusEnum('status').notNull(),
  purchasePrice: numeric('purchase_price', { precision: 10, scale: 2 }).notNull(),
  sellingPrice: numeric('selling_price', { precision: 10, scale: 2 }),
  soldPrice: numeric('sold_price', { precision: 10, scale: 2 }),
  stock: integer('stock').notNull(),
  purchaseDate: timestamp('purchase_date').notNull(),
  soldDate: timestamp('sold_date'),
  platform: text('platform'), // e.g., 'StockX', 'GOAT', 'eBay', 'Facebook', etc.
  notes: text('notes')
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let moreProducts = await db.select().from(products).limit(6).offset(offset);
  let newOffset = moreProducts.length >= 6 ? offset + 5 : null;
  let totalProducts = await db.select({ count: count() }).from(products);

  return {
    products: moreProducts.slice(0, 5),
    newOffset,
    totalProducts: totalProducts[0]?.count ?? 0
  };
}

export async function getDashboardStats(): Promise<{
  totalInventoryValue: number;
  totalProfit: number;
  totalSoldItems: number;
  totalInStock: number;
  totalInvestment: number;
  totalPendingValue: number;
}> {
  const allProducts = await db.select().from(products);
  
  const totalInventoryValue = allProducts
    .filter((p: SelectProduct) => p.status === 'in_stock' || p.status === 'listed')
    .reduce((sum: number, p: SelectProduct) => sum + Number(p.purchasePrice) * p.stock, 0);
  
  const soldProducts = allProducts.filter((p: SelectProduct) => p.status === 'sold');
  const totalProfit = soldProducts
    .reduce((sum: number, p: SelectProduct) => sum + (Number(p.soldPrice || 0) - Number(p.purchasePrice)), 0);
  
  const totalSoldItems = soldProducts.length;
  const totalInStock = allProducts
    .filter((p: SelectProduct) => p.status === 'in_stock')
    .reduce((sum: number, p: SelectProduct) => sum + p.stock, 0);
  
  const totalInvestment = allProducts
    .reduce((sum: number, p: SelectProduct) => sum + Number(p.purchasePrice) * p.stock, 0);
  
  const totalPendingValue = allProducts
    .filter((p: SelectProduct) => p.status === 'pending')
    .reduce((sum: number, p: SelectProduct) => sum + Number(p.sellingPrice || 0), 0);

  return {
    totalInventoryValue,
    totalProfit,
    totalSoldItems,
    totalInStock,
    totalInvestment,
    totalPendingValue
  };
}
