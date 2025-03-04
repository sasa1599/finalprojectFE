import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  ShoppingCart,
  Users,
  Store,
} from "lucide-react";

interface OverviewTabProps {
  stats: any; // Replace with proper type
  error: string | null;
  formatCurrency: (amount: number) => string;
}

// Determine arrow and color based on growth rate
const renderGrowthIndicator = (rate: string) => {
  const growthRate = parseFloat(rate);
  if (growthRate > 0) {
    return {
      arrow: <ArrowUp className="h-4 w-4 text-green-500" />,
      color: "text-green-500",
    };
  } else if (growthRate < 0) {
    return {
      arrow: <ArrowDown className="h-4 w-4 text-red-500" />,
      color: "text-red-500",
    };
  } else {
    return {
      arrow: null,
      color: "text-gray-500",
    };
  }
};

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  error,
  formatCurrency,
}) => {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-bold">Error Loading Dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const revenueGrowth = renderGrowthIndicator(stats.revenue.growthRate);
  const userGrowth = renderGrowthIndicator(stats.users.growthRate);

  return (
    <>
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue KPI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.revenue.total)}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {revenueGrowth.arrow}
              <span className={`${revenueGrowth.color} ml-1`}>
                {stats.revenue.growthRate}% from last period
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Recent revenue: {formatCurrency(stats.revenue.recent)}
            </p>
          </CardContent>
        </Card>

        {/* Orders KPI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.orders.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Avg. order value:{" "}
              {formatCurrency(stats.revenue.total / stats.orders.total)}
            </p>
          </CardContent>
        </Card>

        {/* Users KPI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.users.total.toLocaleString()}
            </div>
            <div className="flex items-center pt-1 text-xs">
              {userGrowth.arrow}
              <span className={`${userGrowth.color} ml-1`}>
                {stats.users.growthRate}% growth
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              New users: {stats.users.new.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Stores KPI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.stores.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Products: {stats.products.total.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Stores */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Stores</CardTitle>
            <CardDescription>
              The top 5 stores by revenue in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPerformers.stores.map((store: any, index: number) => (
                <div key={store.store_id} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {store.store_name || `Store ${store.store_id}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {store.store_id}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(store.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Categories</CardTitle>
            <CardDescription>
              The most popular product categories by sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPerformers.categories.map(
                (category: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {category.category_name || "Unknown Category"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Units sold: {category.units_sold.toLocaleString()}
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(category.sales)}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
