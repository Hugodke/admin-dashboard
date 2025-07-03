import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { ProductsTable } from '../products-table';
import { getProducts, getDashboardStats } from '@/lib/db';

export default async function ProfitPage(
  props: {
    searchParams: Promise<{ q: string; offset: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { products } = await getProducts(search, Number(offset));
  const stats = await getDashboardStats();

  // Calculate detailed profit metrics
  const soldProducts = products.filter(p => p.status === 'sold');
  const profitableItems = soldProducts.filter(p => {
    const profit = Number(p.soldPrice || 0) - Number(p.purchasePrice);
    return profit > 0;
  });
  const lossItems = soldProducts.filter(p => {
    const profit = Number(p.soldPrice || 0) - Number(p.purchasePrice);
    return profit < 0;
  });

  const averageProfit = soldProducts.length > 0 ? 
    stats.totalProfit / soldProducts.length : 0;

  const profitMargin = stats.totalInvestment > 0 ? 
    (stats.totalProfit / stats.totalInvestment) * 100 : 0;

  // Calculate potential profit from listed items
  const potentialProfit = products
    .filter(p => p.status === 'listed')
    .reduce((sum, p) => sum + (Number(p.sellingPrice || 0) - Number(p.purchasePrice)), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalSoldItems} sold items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMargin >= 0 ? '+' : ''}{profitMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Return on investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {averageProfit >= 0 ? '+' : ''}${averageProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per sold item
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {potentialProfit >= 0 ? '+' : ''}${potentialProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From listed items
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Profitable Items ({profitableItems.length})
            </CardTitle>
            <CardDescription>
              Items that generated profit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profitableItems.slice(0, 5).map((product) => {
                const profit = Number(product.soldPrice || 0) - Number(product.purchasePrice);
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${product.purchasePrice} → ${product.soldPrice}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-green-600">
                      +${profit.toFixed(2)}
                    </Badge>
                  </div>
                );
              })}
              {profitableItems.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No profitable items yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Loss Items ({lossItems.length})
            </CardTitle>
            <CardDescription>
              Items that resulted in losses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lossItems.slice(0, 5).map((product) => {
                const loss = Number(product.soldPrice || 0) - Number(product.purchasePrice);
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${product.purchasePrice} → ${product.soldPrice}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-red-600">
                      ${loss.toFixed(2)}
                    </Badge>
                  </div>
                );
              })}
              {lossItems.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No loss items - great job!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sold Items</CardTitle>
          <CardDescription>
            Complete history of your sold items with profit/loss breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsTable
            products={soldProducts}
            offset={0}
            totalProducts={soldProducts.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}
