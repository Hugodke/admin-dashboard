# Reselling/Scalping Stock Management Dashboard

This is a Next.js admin dashboard template that has been customized for reselling/scalping business management. It helps track inventory, profits, and overall business performance.

## Features

### 📊 Dashboard Overview
- **Total Investment**: Money currently invested in inventory
- **Current Inventory Value**: Value of items in stock and listed
- **Total Profit**: Realized profit from sold items
- **Pending Sales**: Potential income from listed items

### 📦 Inventory Management
- Track items by status: In Stock, Listed, Sold, Pending
- Support for multiple product details:
  - Brand, Model, Size, Condition
  - Purchase price, selling price, sold price
  - Purchase date, sold date
  - Platform (StockX, GOAT, eBay, etc.)
  - Notes for additional information

### 💰 Profit/Loss Analysis
- Individual item profit breakdown
- Profit margins and performance metrics
- Revenue and cost tracking
- Average profit per item

### 🎯 Business-Specific Features
- **Multi-platform support**: Track sales across StockX, GOAT, eBay, Facebook Marketplace, etc.
- **Size tracking**: Essential for sneakers and apparel
- **Brand/Model categorization**: Organize inventory by product details
- **Condition tracking**: New, used, etc.
- **Date tracking**: Purchase and sale dates for performance analysis

## Database Schema

The database has been updated to include reselling-specific fields:

- `brand` - Product brand (Nike, Adidas, etc.)
- `model` - Product model (Air Jordan 1, Yeezy 350, etc.)
- `size` - Product size
- `condition` - Product condition (new, used, etc.)
- `purchasePrice` - Amount paid for the item
- `sellingPrice` - Listed/asking price
- `soldPrice` - Actual sale price
- `purchaseDate` - When the item was purchased
- `soldDate` - When the item was sold
- `platform` - Where the item was sold (StockX, GOAT, eBay, etc.)
- `notes` - Additional notes about the item

## Status Types

- **in_stock**: Items you own but haven't listed yet
- **listed**: Items currently listed for sale
- **sold**: Items that have been sold
- **pending**: Items with pending sales (awaiting payment/shipping)

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up your database**:
   - Create a PostgreSQL database
   - Add your database URL to `.env.local`:
     ```
     POSTGRES_URL=your_database_url_here
     ```

3. **Run database migrations**:
   ```bash
   npx drizzle-kit push:pg
   ```

4. **Seed the database** (optional):
   Visit `/api/seed` in your browser to populate with sample data

5. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Navigation

The dashboard includes the following sections:

- **Dashboard**: Overview with key metrics and all items
- **Inventory**: Items in stock and listed for sale
- **Sold Items**: Completed sales with profit tracking
- **Profit/Loss**: Detailed profitability analysis
- **Analytics**: Performance metrics and trends

## Sample Data

The seeder includes realistic examples of reselling items:
- Sneakers (Jordan 1, Yeezy 350, Nike Dunk, etc.)
- Electronics (PlayStation 5)
- Streetwear (Supreme hoodie, Off-White collaborations)

## Customization

You can easily customize this dashboard for your specific needs:

- Add new product categories
- Include additional platforms
- Modify profit calculations
- Add new metrics and analytics
- Integrate with external APIs (StockX, GOAT, etc.)

## Technologies Used

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Drizzle ORM**: Database ORM
- **PostgreSQL**: Database
- **Radix UI**: UI components
- **Lucide Icons**: Icons

---

Perfect for resellers and scalpers who want to:
- Track inventory and profits professionally
- Monitor performance across multiple platforms
- Make data-driven business decisions
- Scale their operations efficiently
