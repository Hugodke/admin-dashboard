import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, Calendar, DollarSign } from 'lucide-react';
import { ProductsTable } from '../products-table';
import { getProducts } from '@/lib/db';

export default async function SoldPage(
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

  // Filter for sold items
  const soldProducts = products.filter(p => p.status === 'sold');
  
  // Calculate stats
  const totalRevenue = soldProducts.reduce((sum, p) => sum + Number(p.soldPrice || 0), 0);
  const totalCost = soldProducts.reduce((sum, p) => sum + Number(p.purchasePrice), 0);
  const totalProfit = totalRevenue - totalCost;
  const averageProfit = soldProducts.length > 0 ? totalProfit / soldProducts.length : 0;

  // Sort by most recent sales
  const recentSales = soldProducts
    .sort((a, b) => new Date(b.soldDate || 0).getTime() - new Date(a.soldDate || 0).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              Items sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Gross sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              After costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {averageProfit >= 0 ? '+' : ''}${averageProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per item
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Sales
          </CardTitle>
          <CardDescription>
            Your most recent sales activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSales.map((product) => {
              const profit = Number(product.soldPrice || 0) - Number(product.purchasePrice);
              return (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Sold: {product.soldDate?.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{product.platform}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">${product.soldPrice}</div>
                      <div className="text-sm text-muted-foreground">
                        Cost: ${product.purchasePrice}
                      </div>
                    </div>
                    <Badge 
                      variant={profit >= 0 ? "default" : "destructive"}
                      className={profit >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}
                    >
                      {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {recentSales.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No sales yet - start selling to see your history here!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Sold Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sold Items</CardTitle>
          <CardDescription>
            Complete history of your sold inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable
            products={soldProducts}
            offset={newOffset ?? 0}
            totalProducts={soldProducts.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
