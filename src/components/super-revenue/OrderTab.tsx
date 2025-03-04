import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatus } from "@/types/revenuesuper-types";
import { format } from "date-fns";
import { Search, MoreHorizontal, FileDown, Eye } from "lucide-react";
import Link from "next/link";

interface OrdersTabProps {
  orders: any; // Replace with proper type
  error: string | null;
  searchTerm: string;
  statusFilter: OrderStatus | undefined;
  pageSize: number;
  formatCurrency: (amount: number) => string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  handleStatusChange: (status: string) => void;
  handlePageSizeChange: (size: string) => void;
  handlePageChange: (page: number) => void;
  fetchOrders: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  error,
  searchTerm,
  statusFilter,
  pageSize,
  formatCurrency,
  setSearchTerm,
  handleSearch,
  handleStatusChange,
  handlePageSizeChange,
  handlePageChange,
  fetchOrders,
}) => {
  // Get status badge styles
  const getStatusBadge = (status: OrderStatus) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

    switch (status) {
      case OrderStatus.pending:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case OrderStatus.awaiting_payment:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case OrderStatus.processing:
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case OrderStatus.shipped:
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case OrderStatus.completed:
        return `${baseClasses} bg-green-100 text-green-800`;
      case OrderStatus.cancelled:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const renderFilters = () => (
    <Card>
      <CardHeader>
        <CardTitle>Filter Orders</CardTitle>
        <CardDescription>Search and filter through all orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Input
              placeholder="Search by order ID or customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={statusFilter || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={OrderStatus.pending}>Pending</SelectItem>
              <SelectItem value={OrderStatus.awaiting_payment}>
                Awaiting Payment
              </SelectItem>
              <SelectItem value={OrderStatus.processing}>Processing</SelectItem>
              <SelectItem value={OrderStatus.shipped}>Shipped</SelectItem>
              <SelectItem value={OrderStatus.completed}>Completed</SelectItem>
              <SelectItem value={OrderStatus.cancelled}>Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <>
        {renderFilters()}
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h3 className="font-bold">Error Loading Orders</h3>
          <p>{error}</p>
          <Button
            onClick={() => fetchOrders()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </>
    );
  }

  if (!orders) {
    return renderFilters();
  }

  return (
    <>
      {renderFilters()}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Orders</CardTitle>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.orders.map((order: any) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">
                    #{order.order_id}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {order.user.first_name} {order.user.last_name}
                    <div className="text-xs text-muted-foreground">
                      {order.user.email}
                    </div>
                  </TableCell>
                  <TableCell>{order.store.store_name}</TableCell>
                  <TableCell>{formatCurrency(order.total_price)}</TableCell>
                  <TableCell>
                    <span className={getStatusBadge(order.order_status)}>
                      {order.order_status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/admin/orders/${order.order_id}`}>
                            <div className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {orders.pagination && orders.pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(
                          Math.max(1, orders.pagination.page - 1)
                        )
                      }
                      className={
                        orders.pagination.page === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: Math.min(5, orders.pagination.totalPages) },
                    (_, i) => {
                      // Show 2 pages before and after current page, or up to 5 pages total
                      let pageNum;
                      if (orders.pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        const start = Math.max(1, orders.pagination.page - 2);
                        const end = Math.min(
                          orders.pagination.totalPages,
                          start + 4
                        );
                        pageNum = start + i;
                        if (pageNum > end) return null;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={pageNum === orders.pagination.page}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  {orders.pagination.totalPages > 5 &&
                    orders.pagination.page <
                      orders.pagination.totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <span className="mx-1">...</span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() =>
                              handlePageChange(orders.pagination.totalPages)
                            }
                          >
                            {orders.pagination.totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(
                            orders.pagination.totalPages,
                            orders.pagination.page + 1
                          )
                        )
                      }
                      className={
                        orders.pagination.page === orders.pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="text-sm text-muted-foreground mt-4">
            Showing {(orders.pagination.page - 1) * orders.pagination.limit + 1}{" "}
            to{" "}
            {Math.min(
              orders.pagination.page * orders.pagination.limit,
              orders.pagination.total
            )}{" "}
            of {orders.pagination.total} orders
          </div>
        </CardContent>
      </Card>
    </>
  );
};
