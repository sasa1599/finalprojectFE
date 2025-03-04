// src/services/report.service.ts

import { InventoryReportResponse, ApiError } from '../types/reports-store-types';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL_BE

export class ReportService {
  private static getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getInventoryReport(): Promise<InventoryReportResponse> {
    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData as ApiError;
      }

      return await response.json() as InventoryReportResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw { 
          status: 'error', 
          message: error.message 
        } as ApiError;
      }
      throw { 
        status: 'error', 
        message: 'Failed to fetch inventory report' 
      } as ApiError;
    }
  }
}