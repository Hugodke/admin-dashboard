import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle, Package, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductsTable } from './products-table';
import { getProducts, getDashboardStats } from '@/lib/db';

export default async function DashboardPage(
  props: {
    searchParams: Promise<{ q: string; offset: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { products, newOffset, totalProducts } = await getProducts(
    search,
    Number(offset)
  );

  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalInvestment.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Money invested in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalInStock} items in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalSoldItems} sold items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPendingValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Potential income from listed items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management */}
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="in_stock">In Stock</TabsTrigger>
            <TabsTrigger value="listed">Listed</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
            <TabsTrigger value="pending" className="hidden sm:flex">
              Pending
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Item
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <ProductsTable
            products={products}
            offset={newOffset ?? 0}
            totalProducts={totalProducts}
          />
        </TabsContent>
        <TabsContent value="in_stock">
          <ProductsTable
            products={products.filter(p => p.status === 'in_stock')}
            offset={newOffset ?? 0}
            totalProducts={products.filter(p => p.status === 'in_stock').length}
          />
        </TabsContent>
        <TabsContent value="listed">
          <ProductsTable
            products={products.filter(p => p.status === 'listed')}
            offset={newOffset ?? 0}
            totalProducts={products.filter(p => p.status === 'listed').length}
          />
        </TabsContent>
        <TabsContent value="sold">
          <ProductsTable
            products={products.filter(p => p.status === 'sold')}
            offset={newOffset ?? 0}
            totalProducts={products.filter(p => p.status === 'sold').length}
          />
        </TabsContent>
        <TabsContent value="pending">
          <ProductsTable
            products={products.filter(p => p.status === 'pending')}
            offset={newOffset ?? 0}
            totalProducts={products.filter(p => p.status === 'pending').length}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
