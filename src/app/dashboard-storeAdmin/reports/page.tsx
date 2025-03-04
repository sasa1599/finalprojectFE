// app/dashboard-storeAdmin/reports/page.tsx
"use client";

import React from 'react';
import { InventoryReport } from '@/components/store-reports/InvetoryReports';

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Report</h1>
      <InventoryReport />
    </div>
  );
}