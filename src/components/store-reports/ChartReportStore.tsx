'use client';

import { 
  BarChart, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Package, 
  DollarSign,
  FileDown,
  Loader2
} from 'lucide-react';
import { useState, useRef } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { exportComponentToPDF } from '@/utils/pdfEksport';

// Colors for charts
const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

// Define types for the inventory data
interface InventoryItem {
  product_id: number;
  product_name: string;
  category: string;
  current_quantity: number;
  total_quantity: number;
  price: number;
  estimated_value: number;
  last_updated: string;
}

interface ReportSummary {
  product_count: number;
  total_items: number;
  total_value: number;
}

interface StoreReport {
  store_name: string;
  report_date: string;
  summary: ReportSummary;
  inventory: InventoryItem[];
}

interface CategoryData {
  category: string;
  quantity: number;
  value: number;
}

interface ProductChartData {
  name: string;
  quantity?: number;
  value?: number;
}

interface StockStatusData {
  name: string;
  value: number;
}

interface StoreInventoryChartsProps {
  report: StoreReport;
}

export const StoreInventoryCharts: React.FC<StoreInventoryChartsProps> = ({ report }) => {
  const [chartType, setChartType] = useState<'quantity' | 'value'>('quantity');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  if (!report) return null;
  
  // Prepare data for category chart
  const categoryData: CategoryData[] = [];
  const categoryMap = new Map<string, CategoryData>();
  
  report.inventory.forEach((item: InventoryItem) => {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, {
        category: item.category,
        quantity: 0,
        value: 0
      });
    }
    
    const categoryEntry = categoryMap.get(item.category);
    if (categoryEntry) {
      categoryEntry.quantity += item.current_quantity;
      categoryEntry.value += item.estimated_value;
    }
  });
  
  categoryMap.forEach(entry => {
    categoryData.push(entry);
  });
  
  // Prepare data for top products chart
  const productData: ProductChartData[] = [...report.inventory]
    .sort((a: InventoryItem, b: InventoryItem) => 
      chartType === 'quantity' 
        ? b.current_quantity - a.current_quantity 
        : b.estimated_value - a.estimated_value
    )
    .slice(0, 5)
    .map((item: InventoryItem) => ({
      name: item.product_name,
      [chartType]: chartType === 'quantity' ? item.current_quantity : item.estimated_value
    }));
  
  // Prepare data for stock status chart
  const stockStatusData: StockStatusData[] = [
    { name: 'Low Stock', value: report.inventory.filter(item => item.current_quantity < 10).length },
    { name: 'Adequate', value: report.inventory.filter(item => item.current_quantity >= 10 && item.current_quantity < 50).length },
    { name: 'Well Stocked', value: report.inventory.filter(item => item.current_quantity >= 50).length }
  ];
  
  // Format y-axis tick values based on chart type
  const formatYAxisTick = (value: any): string => {
    const numValue = Number(value);
    if (chartType === 'quantity') {
      return numValue >= 1000 ? `${(numValue / 1000).toFixed(0)}K` : String(numValue);
    } else {
      // For value, format as currency
      return numValue >= 1000000 
        ? `${(numValue / 1000000).toFixed(1)}M` 
        : numValue >= 1000 
          ? `${(numValue / 1000).toFixed(0)}K` 
          : String(numValue);
    }
  };
  
  // Handle PDF export
  const handleExportToPDF = async () => {
    if (!chartContainerRef.current || isExporting) return;
    
    setIsExporting(true);
    try {
      await exportComponentToPDF(chartContainerRef, {
        title: `${report.store_name} - Inventory Analytics`,
        filename: `inventory-report-${report.store_name.toLowerCase().replace(/\s+/g, '-')}`,
        includeTimestamp: true,
        scale: 2
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Chart header with toggle and export button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Package className="h-5 w-5 mr-2 text-blue-600" />
          Inventory Analytics
        </h2>
        <div className="flex gap-2">
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button 
              className={`px-3 py-2 text-sm ${chartType === 'quantity' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setChartType('quantity')}
            >
              <span className="flex items-center">
                <Package className="h-4 w-4 mr-1" />
                Quantity
              </span>
            </button>
            <button 
              className={`px-3 py-2 text-sm ${chartType === 'value' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setChartType('value')}
            >
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Value
              </span>
            </button>
          </div>
          
          <button 
            onClick={handleExportToPDF}
            disabled={isExporting}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Charts */}
      <div ref={chartContainerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center">
            <PieChartIcon className="h-4 w-4 mr-1 text-blue-500" />
            Inventory by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey={chartType === 'quantity' ? 'quantity' : 'value'}
                  nameKey="category"
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => {
                    if (chartType === 'quantity') {
                      return [`${value} units`, 'Quantity'];
                    } else {
                      return [`Rp ${Number(value).toLocaleString()}`, 'Value'];
                    }
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top products chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center">
            <BarChart className="h-4 w-4 mr-1 text-blue-500" />
            Top 5 Products by {chartType === 'quantity' ? 'Quantity' : 'Value'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={productData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatYAxisTick} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip
                  formatter={(value) => {
                    if (chartType === 'quantity') {
                      return [`${value} units`, 'Quantity'];
                    } else {
                      return [`Rp ${Number(value).toLocaleString()}`, 'Value'];
                    }
                  }}
                />
                <Legend />
                <Bar 
                  dataKey={chartType} 
                  name={chartType === 'quantity' ? 'Units' : 'Value'} 
                  fill="#3b82f6" 
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Stock status chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center">
            <PieChartIcon className="h-4 w-4 mr-1 text-blue-500" />
            Stock Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell key="cell-0" fill="#ef4444" /> {/* Low Stock - Red */}
                  <Cell key="cell-1" fill="#f59e0b" /> {/* Adequate - Orange */}
                  <Cell key="cell-2" fill="#10b981" /> {/* Well Stocked - Green */}
                </Pie>
                <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Inventory trend chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-4 flex items-center">
            <LineChartIcon className="h-4 w-4 mr-1 text-blue-500" />
            Product Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={report.inventory.slice(0, 10)} // Top 10 products
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product_name" />
                <YAxis tickFormatter={formatYAxisTick} />
                <Tooltip
                  formatter={(value) => {
                    if (chartType === 'quantity') {
                      return [`${value} units`, 'Quantity'];
                    } else {
                      return [`Rp ${Number(value).toLocaleString()}`, 'Value'];
                    }
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={chartType === 'quantity' ? 'current_quantity' : 'estimated_value'}
                  name={chartType === 'quantity' ? 'Units' : 'Value'}
                  stroke="#8b5cf6"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};