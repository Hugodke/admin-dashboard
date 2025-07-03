import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductsTable } from '../products-table';
import { getProducts } from '@/lib/db';

export default async function InventoryPage(
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

  // Filter products for inventory (in stock and listed)
  const inventoryProducts = products.filter(p => p.status === 'in_stock' || p.status === 'listed');
  const inStockProducts = products.filter(p => p.status === 'in_stock');
  const listedProducts = products.filter(p => p.status === 'listed');

  return (
    <div className="flex flex-col gap-6">
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Items in stock + listed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready to list
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listed Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listedProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently for sale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management */}
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All Inventory</TabsTrigger>
            <TabsTrigger value="in_stock">In Stock</TabsTrigger>
            <TabsTrigger value="listed">Listed</TabsTrigger>
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
            products={inventoryProducts}
            offset={newOffset ?? 0}
            totalProducts={inventoryProducts.length}
          />
        </TabsContent>
        
        <TabsContent value="in_stock">
          <ProductsTable
            products={inStockProducts}
            offset={newOffset ?? 0}
            totalProducts={inStockProducts.length}
          />
        </TabsContent>
        
        <TabsContent value="listed">
          <ProductsTable
            products={listedProducts}
            offset={newOffset ?? 0}
            totalProducts={listedProducts.length}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
