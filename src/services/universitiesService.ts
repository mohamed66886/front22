import type { University } from '@/types/api';

class UniversitiesService {
  private readonly API_BASE_URL = 'http://localhost:5000/api';

  private getAuthHeaders(skipAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (!skipAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async getAll(skipAuth: boolean = false): Promise<University[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Universities`, {
        method: 'GET',
        headers: this.getAuthHeaders(skipAuth),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch universities');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<University> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Universities/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch university');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching university:', error);
      throw error;
    }
  }

  async create(data: Omit<University, 'university_id'>): Promise<University> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Universities`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create university');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating university:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<University>): Promise<University> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Universities/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update university');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating university:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Universities/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete university');
      }
    } catch (error) {
      console.error('Error deleting university:', error);
      throw error;
    }
  }
}

export const universitiesApi = new UniversitiesService();
export type { University };
