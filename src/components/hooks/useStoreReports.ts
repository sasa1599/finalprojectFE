// src/components/hooks/useStoreReports.ts
"use client";

import { useState, useEffect } from 'react';
import { InventoryReport, ApiError } from '@/types/reports-store-types';
import { ReportService } from '@/services/reports-store';

export const useInventoryReport = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [report, setReport] = useState<InventoryReport | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ReportService.getInventoryReport();
      setReport(response.data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return {
    report,
    loading,
    error,
    refetch: fetchReport,
  };
};