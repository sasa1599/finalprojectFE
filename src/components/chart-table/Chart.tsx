"use client";

import {
  BarChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";
import { useEffect, useState } from "react";

interface SalesData {
  month: string;
  total: number;
  electronics: number;
  accessories: number;
}

interface StockData {
  product: string;
  initial: number;
  additions: number;
  reductions: number;
  final: number;
}

interface ChartProps<T> {
  data: T[];
}

export function SalesChart({ data }: ChartProps<SalesData>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full overflow-x-auto">
      <BarChart width={800} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#3b82f6" />
      </BarChart>
    </div>
  );
}

export function StockChart({ data }: ChartProps<StockData>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full overflow-x-auto">
      <LineChart width={800} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="product" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="final" stroke="#3b82f6" />
      </LineChart>
    </div>
  );
}
