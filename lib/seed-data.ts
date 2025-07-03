import { db, products } from './db';

const sampleProducts = [
  {
    imageUrl: '/placeholder.svg',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Nike',
    model: 'Air Jordan 1',
    size: '10.5',
    condition: 'new',
    status: 'sold' as const,
    purchasePrice: '170.00',
    sellingPrice: '280.00',
    soldPrice: '265.00',
    stock: 0,
    purchaseDate: new Date('2024-11-15'),
    soldDate: new Date('2024-12-01'),
    platform: 'StockX',
    notes: 'Chicago colorway, great condition'
  },
  {
    imageUrl: '/placeholder.svg',
    name: 'PlayStation 5 Console',
    brand: 'Sony',
    model: 'PS5',
    size: null,
    condition: 'new',
    status: 'in_stock' as const,
    purchasePrice: '499.99',
    sellingPrice: '650.00',
    soldPrice: null,
    stock: 2,
    purchaseDate: new Date('2024-12-10'),
    soldDate: null,
    platform: 'Facebook Marketplace',
    notes: 'Sealed, brand new condition'
  },
  {
    imageUrl: '/placeholder.svg',
    name: 'Yeezy Boost 350 V2',
    brand: 'Adidas',
    model: 'Yeezy 350 V2',
    size: '9',
    condition: 'new',
    status: 'listed' as const,
    purchasePrice: '220.00',
    sellingPrice: '350.00',
    soldPrice: null,
    stock: 1,
    purchaseDate: new Date('2024-12-05'),
    soldDate: null,
    platform: 'GOAT',
    notes: 'Cream White colorway'
  },
  {
    imageUrl: '/placeholder.svg',
    name: 'Supreme Box Logo Hoodie',
    brand: 'Supreme',
    model: 'Box Logo Hoodie',
    size: 'L',
    condition: 'new',
    status: 'pending' as const,
    purchasePrice: '180.00',
    sellingPrice: '420.00',
    soldPrice: null,
    stock: 1,
    purchaseDate: new Date('2024-12-01'),
    soldDate: null,
    platform: 'Grailed',
    notes: 'FW24 Black colorway'
  },
  {
    imageUrl: '/placeholder.svg',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    size: '256GB',
    condition: 'new',
    status: 'sold' as const,
    purchasePrice: '1199.00',
    sellingPrice: '1350.00',
    soldPrice: '1325.00',
    stock: 0,
    purchaseDate: new Date('2024-11-20'),
    soldDate: new Date('2024-12-15'),
    platform: 'eBay',
    notes: 'Natural Titanium, sealed'
  },
  {
    imageUrl: '/placeholder.svg',
    name: 'Travis Scott x Jordan 1 Low',
    brand: 'Nike',
    model: 'Air Jordan 1 Low',
    size: '11',
    condition: 'new',
    status: 'in_stock' as const,
    purchasePrice: '450.00',
    sellingPrice: '800.00',
    soldPrice: null,
    stock: 1,
    purchaseDate: new Date('2024-12-08'),
    soldDate: null,
    platform: 'StockX',
    notes: 'Fragment colorway, deadstock'
  }
];

export async function seedDatabase() {
  try {
    // Clear existing data
    await db.delete(products);
    
    // Insert sample data
    await db.insert(products).values(sampleProducts);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
