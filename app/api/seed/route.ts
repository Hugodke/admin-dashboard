import { db, products } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Clear existing data
    await db.delete(products);

    // Insert sample reselling/scalping items
    await db.insert(products).values([
      {
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
        name: 'Air Jordan 1 Retro High OG',
        brand: 'Nike',
        model: 'Air Jordan 1',
        size: '10.5',
        condition: 'new',
        status: 'sold',
        purchasePrice: '170.00',
        sellingPrice: '300.00',
        soldPrice: '285.00',
        stock: 1,
        purchaseDate: new Date('2024-01-15'),
        soldDate: new Date('2024-01-20'),
        platform: 'StockX',
        notes: 'Chicago colorway, high demand'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
        name: 'Adidas Yeezy Boost 350 V2',
        brand: 'Adidas',
        model: 'Yeezy 350 V2',
        size: '9',
        condition: 'new',
        status: 'listed',
        purchasePrice: '230.00',
        sellingPrice: '400.00',
        soldPrice: null,
        stock: 1,
        purchaseDate: new Date('2024-02-01'),
        soldDate: null,
        platform: 'GOAT',
        notes: 'Zebra colorway, waiting for price increase'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop',
        name: 'Nike Dunk Low',
        brand: 'Nike',
        model: 'Dunk Low',
        size: '11',
        condition: 'new',
        status: 'in_stock',
        purchasePrice: '110.00',
        sellingPrice: '180.00',
        soldPrice: null,
        stock: 2,
        purchaseDate: new Date('2024-02-15'),
        soldDate: null,
        platform: null,
        notes: 'Panda colorway, holding for better price'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
        name: 'New Balance 550',
        brand: 'New Balance',
        model: '550',
        size: '10',
        condition: 'new',
        status: 'sold',
        purchasePrice: '130.00',
        sellingPrice: '200.00',
        soldPrice: '195.00',
        stock: 1,
        purchaseDate: new Date('2024-01-25'),
        soldDate: new Date('2024-02-10'),
        platform: 'Facebook Marketplace',
        notes: 'White/Green colorway, local sale'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop',
        name: 'Travis Scott Jordan 1 Low',
        brand: 'Nike',
        model: 'Jordan 1 Low',
        size: '9.5',
        condition: 'new',
        status: 'pending',
        purchasePrice: '650.00',
        sellingPrice: '1200.00',
        soldPrice: null,
        stock: 1,
        purchaseDate: new Date('2024-02-20'),
        soldDate: null,
        platform: 'StockX',
        notes: 'Fragment collab, high value item'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&h=300&fit=crop',
        name: 'PlayStation 5',
        brand: 'Sony',
        model: 'PS5',
        size: null,
        condition: 'new',
        status: 'sold',
        purchasePrice: '499.99',
        sellingPrice: '650.00',
        soldPrice: '625.00',
        stock: 1,
        purchaseDate: new Date('2024-01-10'),
        soldDate: new Date('2024-01-12'),
        platform: 'eBay',
        notes: 'Console restocking opportunity'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&h=300&fit=crop',
        name: 'Supreme Box Logo Hoodie',
        brand: 'Supreme',
        model: 'Box Logo Hoodie',
        size: 'M',
        condition: 'new',
        status: 'in_stock',
        purchasePrice: '168.00',
        sellingPrice: '450.00',
        soldPrice: null,
        stock: 1,
        purchaseDate: new Date('2024-02-05'),
        soldDate: null,
        platform: null,
        notes: 'Black colorway, F/W 2024'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
        name: 'Off-White x Nike Air Max 90',
        brand: 'Nike',
        model: 'Air Max 90',
        size: '10',
        condition: 'new',
        status: 'listed',
        purchasePrice: '450.00',
        sellingPrice: '800.00',
        soldPrice: null,
        stock: 1,
        purchaseDate: new Date('2024-01-30'),
        soldDate: null,
        platform: 'GOAT',
        notes: 'Desert Ore colorway, Virgil Abloh collab'
      }
    ]);

    return Response.json({
      message: 'Database seeded successfully with reselling items!',
      count: 8
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return Response.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
