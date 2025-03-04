'use client';

import React from 'react';
import { 
  BarChart, 
  LineChart as LineChartIcon,
  DollarSign, 
  TrendingUp,
  ArrowUpDown
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { formatRupiah } from '@/helper/currencyRp';


// Colors
const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#8b5cf6',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4'
};

interface MonthlyRevenue {
  month: number;
  total_revenue: number;
}

interface YearlyRevenue {
  year: number;
  total_revenue: number;
}

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  order_date: string;
  status: string;
  total_price: number;
}

interface RevenueChartProps {
  revenueData: {
    revenue: MonthlyRevenue[] | YearlyRevenue[];
  };
  ordersData?: {
    totalOrders: number;
    totalRevenue: number;
    orders: Order[];
  };
  period: 'monthly' | 'yearly';
  year?: number;
}

export const StoreRevenueCharts: React.FC<RevenueChartProps> = ({ 
  revenueData, 
  ordersData, 
  period, 
  year 
}) => {
  const [chartType, setChartType] = React.useState<'bar' | 'line' | 'area'>('bar');
  
  // Prepare revenue chart data - moved outside conditional return
  const revenueChartData = React.useMemo(() => {
    if (!revenueData || !revenueData.revenue.length) return [];
    
    return revenueData.revenue.map((item: any) => {
      let label = '';
      
      if (period === 'monthly') {
        // Convert month number to month name
        label = new Date(0, item.month - 1).toLocaleString('default', { month: 'short' });
      } else {
        // If year is missing, use the current year or a specified default year
        const defaultYear = year || new Date().getFullYear();
        label = item.year ? item.year.toString() : defaultYear.toString();
      }
      
      return {
        name: label,
        revenue: item.total_revenue
      };
    });
  }, [revenueData, period, year]);
  
  // Prepare order status distribution if orders data is available
  const orderStatusData = React.useMemo(() => {
    const defaultValue: Array<{ name: string; value: number }> = [];
    
    if (!ordersData || !ordersData.orders || !ordersData.orders.length) return defaultValue;
    
    const statusCount: Record<string, number> = {};
    
    ordersData.orders.forEach(order => {
      const status = order.status;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    return Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCount[status]
    }));
  }, [ordersData]);
  
  // Calculate revenue trends (percentage increase/decrease) if we have enough data
  const revenueTrend = React.useMemo(() => {
    if (!revenueChartData.length || revenueChartData.length < 2) {
      return { percentage: '0.0', isPositive: true };
    }
    
    const firstValue = revenueChartData[0].revenue;
    const lastValue = revenueChartData[revenueChartData.length - 1].revenue;
    
    if (firstValue === 0) {
      return { percentage: '0.0', isPositive: true };
    }
    
    const percentChange = ((lastValue - firstValue) / firstValue) * 100;
    return {
      percentage: percentChange.toFixed(1),
      isPositive: percentChange >= 0
    };
  }, [revenueChartData]);
  
  // Calculate average revenue
  const averageRevenue = React.useMemo(() => {
    if (!revenueChartData.length) return 0;
    
    const total = revenueChartData.reduce((sum, item) => sum + item.revenue, 0);
    return total / revenueChartData.length;
  }, [revenueChartData]);
  
  // Format y-axis tick values
  const formatYAxisTick = (value: any): string => {
    const numValue = Number(value);
    return numValue >= 1000000 
      ? `${(numValue / 1000000).toFixed(1)}M` 
      : numValue >= 1000 
        ? `${(numValue / 1000).toFixed(0)}K` 
        : String(numValue);
  };
  
  if (!revenueData || !revenueData.revenue.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center text-gray-500">
        No data available for charts
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Chart header with toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Revenue Analytics {period === 'monthly' && year ? `(${year})` : ''}
        </h2>
        <div className="flex gap-2">
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button 
              className={`px-3 py-2 text-sm ${chartType === 'bar' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setChartType('bar')}
            >
              <span className="flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                Bar
              </span>
            </button>
            <button 
              className={`px-3 py-2 text-sm ${chartType === 'line' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setChartType('line')}
            >
              <span className="flex items-center">
                <LineChartIcon className="h-4 w-4 mr-1" />
                Line
              </span>
            </button>
            <button 
              className={`px-3 py-2 text-sm ${chartType === 'area' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setChartType('area')}
            >
              <span className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Area
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Revenue metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Average Revenue */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-sm text-blue-700 font-medium">Average Revenue</h3>
          <div className="flex items-center mt-2">
            <DollarSign className="h-6 w-6 text-blue-500 mr-2" />
            <p className="text-xl font-bold text-blue-800">
              {formatRupiah(averageRevenue)}
            </p>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Per {period === 'monthly' ? 'month' : 'year'}
          </p>
        </div>
        
        {/* Total Revenue */}
        {ordersData && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <h3 className="text-sm text-green-700 font-medium">Total Revenue</h3>
            <div className="flex items-center mt-2">
              <DollarSign className="h-6 w-6 text-green-500 mr-2" />
              <p className="text-xl font-bold text-green-800">
                {formatRupiah(ordersData.totalRevenue)}
              </p>
            </div>
            <p className="text-xs text-green-600 mt-1">
              From {ordersData.totalOrders} orders
            </p>
          </div>
        )}
        
        {/* Revenue Trend */}
        {revenueTrend && (
          <div className={`${revenueTrend.isPositive ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} border rounded-lg p-4`}>
            <h3 className={`text-sm ${revenueTrend.isPositive ? 'text-green-700' : 'text-red-700'} font-medium`}>
              Revenue Trend
            </h3>
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-6 w-6 ${revenueTrend.isPositive ? 'text-green-500' : 'text-red-500'} mr-2`} />
              <p className={`text-xl font-bold ${revenueTrend.isPositive ? 'text-green-800' : 'text-red-800'}`}>
                {revenueTrend.isPositive ? '+' : ''}{revenueTrend.percentage}%
              </p>
            </div>
            <p className={`text-xs ${revenueTrend.isPositive ? 'text-green-600' : 'text-red-600'} mt-1`}>
              {revenueTrend.isPositive ? 'Increase' : 'Decrease'} from first to last {period === 'monthly' ? 'month' : 'year'}
            </p>
          </div>
        )}
      </div>
      
      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-4">
          {period === 'monthly' ? 'Monthly' : 'Yearly'} Revenue
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <RechartsBarChart
                data={revenueChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxisTick} />
                <Tooltip 
                  formatter={(value) => [formatRupiah(value as number), 'Revenue']}
                  labelFormatter={(label) => `${period === 'monthly' ? 'Month' : 'Year'}: ${label}`}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill={COLORS.primary} />
              </RechartsBarChart>
            ) : chartType === 'line' ? (
              <LineChart
                data={revenueChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxisTick} />
                <Tooltip 
                  formatter={(value) => [formatRupiah(value as number), 'Revenue']}
                  labelFormatter={(label) => `${period === 'monthly' ? 'Month' : 'Year'}: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue" 
                  stroke={COLORS.primary} 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            ) : (
              <AreaChart
                data={revenueChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxisTick} />
                <Tooltip 
                  formatter={(value) => [formatRupiah(value as number), 'Revenue']}
                  labelFormatter={(label) => `${period === 'monthly' ? 'Month' : 'Year'}: ${label}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue" 
                  stroke={COLORS.primary} 
                  fill={`${COLORS.primary}40`} // 40 is the alpha/opacity in hex
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Order Status Distribution if available */}
      {orderStatusData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-4">
            Order Status Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={orderStatusData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip 
                  formatter={(value) => [`${value} orders`, 'Count']}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Orders"
                  fill={COLORS.secondary}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};