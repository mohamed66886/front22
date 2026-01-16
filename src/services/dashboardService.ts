import type { DashboardStats } from '@/types/dashboard';

class DashboardService {
  private readonly API_BASE_URL = 'http://localhost:5000/api';

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getUserDashboard(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Dashboard/user`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async getAdminDashboard(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Dashboard/admin`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin dashboard data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      throw error;
    }
  }
}

export const dashboardApi = new DashboardService();
