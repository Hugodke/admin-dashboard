import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, Package, Clock, Star } from 'lucide-react';
import { getProducts } from '@/lib/db';

export default async function AnalyticsPage() {
  const { products } = await getProducts('', 0);
  
  // Analytics calculations
  const totalItems = products.length;
  const soldItems = products.filter(p => p.status === 'sold');
  const inStockItems = products.filter(p => p.status === 'in_stock');
  const listedItems = products.filter(p => p.status === 'listed');
  
  // Brand analysis
  const brandStats = products.reduce((acc, product) => {
    const brand = product.brand || 'Unknown';
    if (!acc[brand]) {
      acc[brand] = { count: 0, revenue: 0, profit: 0 };
    }
    acc[brand].count += 1;
    if (product.status === 'sold') {
      acc[brand].revenue += Number(product.soldPrice || 0);
      acc[brand].profit += Number(product.soldPrice || 0) - Number(product.purchasePrice);
    }
    return acc;
  }, {} as Record<string, { count: number; revenue: number; profit: number }>);
  
  const topBrands = Object.entries(brandStats)
    .sort(([,a], [,b]) => b.profit - a.profit)
    .slice(0, 5);
  
  // Platform analysis
  const platformStats = soldItems.reduce((acc, product) => {
    const platform = product.platform || 'Unknown';
    if (!acc[platform]) {
      acc[platform] = { count: 0, revenue: 0 };
    }
    acc[platform].count += 1;
    acc[platform].revenue += Number(product.soldPrice || 0);
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);
  
  const topPlatforms = Object.entries(platformStats)
    .sort(([,a], [,b]) => b.revenue - a.revenue)
    .slice(0, 3);
  
  // Time-based analysis
  const averageHoldTime = soldItems.reduce((acc, product) => {
    if (product.soldDate && product.purchaseDate) {
      const holdTime = new Date(product.soldDate).getTime() - new Date(product.purchaseDate).getTime();
      return acc + holdTime / (1000 * 60 * 60 * 24); // Convert to days
    }
    return acc;
  }, 0) / soldItems.length;
  
  const sellThroughRate = totalItems > 0 ? (soldItems.length / totalItems) * 100 : 0;
  
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sell-Through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellThroughRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Items sold vs total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Hold Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHoldTime.toFixed(0)} days</div>
            <p className="text-xs text-muted-foreground">
              Purchase to sale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listedItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently listed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(brandStats).length}</div>
            <p className="text-xs text-muted-foreground">
              Brands in portfolio
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Top Performing Brands
            </CardTitle>
            <CardDescription>
              Brands ranked by profit generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topBrands.map(([brand, stats]) => (
                <div key={brand} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{brand}</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.count} items • ${stats.revenue.toFixed(0)} revenue
                    </span>
                  </div>
                  <Badge 
                    variant={stats.profit >= 0 ? "default" : "destructive"}
                    className={stats.profit >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}
                  >
                    {stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(0)}
                  </Badge>
                </div>
              ))}
              {topBrands.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No brand data available yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Sales Platforms
            </CardTitle>
            <CardDescription>
              Platforms ranked by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPlatforms.map(([platform, stats]) => (
                <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{platform}</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.count} sales
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${stats.revenue.toFixed(0)}</div>
                    <div className="text-sm text-muted-foreground">
                      ${(stats.revenue / stats.count).toFixed(0)} avg
                    </div>
                  </div>
                </div>
              ))}
              {topPlatforms.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No platform data available yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Status Distribution</CardTitle>
          <CardDescription>
            Current status of all your items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{inStockItems.length}</div>
              <div className="text-sm text-muted-foreground">In Stock</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{listedItems.length}</div>
              <div className="text-sm text-muted-foreground">Listed</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{soldItems.length}</div>
              <div className="text-sm text-muted-foreground">Sold</div>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {products.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
