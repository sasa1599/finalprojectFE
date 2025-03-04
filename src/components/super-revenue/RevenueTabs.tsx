import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RevenueTabProps {
  revenue: {
    summary: {
      startDate: string;
      endDate: string;
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      period: string;
    };
    revenueByPeriod: Array<{
      period: string;
      revenue: number;
      orderCount: number;
    }>;
  } | null;
  error: string | null;
  startDate: Date | undefined;
  endDate: Date | undefined;
  periodType: "daily" | "weekly" | "monthly" | "yearly";
  formatCurrency: (amount: number) => string;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setPeriodType: (type: "daily" | "weekly" | "monthly" | "yearly") => void;
  applyRevenueFilters: () => void;
}

export const RevenueTab: React.FC<RevenueTabProps> = ({
  revenue,
  error,
  startDate,
  endDate,
  periodType,
  formatCurrency,
  setStartDate,
  setEndDate,
  setPeriodType,
  applyRevenueFilters,
}) => {
  const renderFilters = () => (
    <Card className="mb-4">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">
          Filter Revenue Data
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Select time period and date range to analyze revenue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">
              Period Type
            </label>
            <Select
              value={periodType}
              onValueChange={(value) => setPeriodType(value as any)}
            >
              <SelectTrigger className="bg-gray-100 text-gray-700 border-gray-200 h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Select period type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100 text-gray-700 border-gray-200 text-xs sm:text-sm">
                <SelectItem className="hover:bg-gray-200" value="daily">
                  Daily
                </SelectItem>
                <SelectItem className="hover:bg-gray-200" value="weekly">
                  Weekly
                </SelectItem>
                <SelectItem className="hover:bg-gray-200" value="monthly">
                  Monthly
                </SelectItem>
                <SelectItem className="hover:bg-gray-200" value="yearly">
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-100 hover:bg-gray-200 border-gray-200 h-9 sm:h-10 text-xs sm:text-sm"
                >
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-100">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="bg-gray-100"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-gray-100 hover:bg-gray-200 border-gray-200 h-9 sm:h-10 text-xs sm:text-sm"
                >
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-100">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="bg-gray-100"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          onClick={applyRevenueFilters}
          className="mt-3 sm:mt-4 md:mt-6 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <>
        {renderFilters()}
        <div className="p-3 sm:p-4 bg-red-50 text-red-800 rounded-md text-xs sm:text-sm">
          <h3 className="font-bold">Error Loading Revenue Data</h3>
          <p>{error}</p>
          <Button
            onClick={applyRevenueFilters}
            variant="outline"
            className="mt-3 sm:mt-4 h-8 sm:h-10 text-xs sm:text-sm"
          >
            Try Again
          </Button>
        </div>
      </>
    );
  }

  if (!revenue) {
    return renderFilters();
  }

  return (
    <>
      {renderFilters()}

      {/* Revenue Summary */}
      <Card className="mb-4">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">
            Revenue Summary
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {format(new Date(revenue.summary.startDate), "PP")} -{" "}
            {format(new Date(revenue.summary.endDate), "PP")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-primary/10 p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm sm:text-base font-medium text-primary mb-1 sm:mb-2">
                Total Revenue
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                {formatCurrency(revenue.summary.totalRevenue)}
              </p>
            </div>

            <div className="bg-primary/10 p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm sm:text-base font-medium text-primary mb-1 sm:mb-2">
                Total Orders
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                {revenue.summary.totalOrders.toLocaleString()}
              </p>
            </div>

            <div className="bg-primary/10 p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm sm:text-base font-medium text-primary mb-1 sm:mb-2">
                Average Order Value
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                {formatCurrency(revenue.summary.averageOrderValue)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="mb-4">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">
            Revenue Trend -{" "}
            {revenue.summary.period.charAt(0).toUpperCase() +
              revenue.summary.period.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-72 md:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenue.revenueByPeriod}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                  tickFormatter={(value) => {
                    // Truncate long period labels on small screens
                    if (window.innerWidth < 640 && value.length > 6) {
                      return value.substring(0, 6) + "...";
                    }
                    return value;
                  }}
                />
                <YAxis tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: window.innerWidth < 640 ? 10 : 12,
                    marginTop: 5,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue"
                  strokeWidth={2}
                  activeDot={{ r: window.innerWidth < 640 ? 6 : 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="orderCount"
                  stroke="#82ca9d"
                  name="Order Count"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Data Table */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Revenue Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:-mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left text-xs sm:text-sm font-medium text-gray-700">
                      Period
                    </th>
                    <th className="p-2 text-right text-xs sm:text-sm font-medium text-gray-700">
                      Orders
                    </th>
                    <th className="p-2 text-right text-xs sm:text-sm font-medium text-gray-700">
                      Revenue
                    </th>
                    <th className="p-2 text-right text-xs sm:text-sm font-medium text-gray-700">
                      Avg. Order Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {revenue.revenueByPeriod.map((period, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="p-2 text-xs sm:text-sm font-medium whitespace-nowrap">
                        {period.period}
                      </td>
                      <td className="p-2 text-xs sm:text-sm text-right whitespace-nowrap">
                        {period.orderCount.toLocaleString()}
                      </td>
                      <td className="p-2 text-xs sm:text-sm text-right whitespace-nowrap">
                        {formatCurrency(period.revenue)}
                      </td>
                      <td className="p-2 text-xs sm:text-sm text-right whitespace-nowrap">
                        {formatCurrency(
                          period.orderCount > 0
                            ? period.revenue / period.orderCount
                            : 0
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5 font-bold">
                    <td className="p-2 text-xs sm:text-sm whitespace-nowrap">
                      Total
                    </td>
                    <td className="p-2 text-xs sm:text-sm text-right whitespace-nowrap">
                      {revenue.summary.totalOrders.toLocaleString()}
                    </td>
                    <td className="p-2 text-xs sm:text-sm text-right whitespace-nowrap">
                      {formatCurrency(revenue.summary.totalRevenue)}
                    </td>
                    <td className="p-2 text-xs sm:text-sm text-right whitespace-nowrap">
                      {formatCurrency(revenue.summary.averageOrderValue)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
