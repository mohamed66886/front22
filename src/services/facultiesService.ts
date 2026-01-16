import type { Faculty } from '@/types/api';

class FacultiesService {
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

  async getAll(skipAuth: boolean = false): Promise<Faculty[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Faculties`, {
        method: 'GET',
        headers: this.getAuthHeaders(skipAuth),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch faculties');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching faculties:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Faculty> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Faculties/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch faculty');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching faculty:', error);
      throw error;
    }
  }

  async getByUniversityId(universityId: number, skipAuth: boolean = false): Promise<Faculty[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Faculties/university/${universityId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(skipAuth),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch faculties by university');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching faculties by university:', error);
      throw error;
    }
  }

  async create(data: Omit<Faculty, 'faculty_id'>): Promise<Faculty> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Faculties`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create faculty');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating faculty:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<Faculty>): Promise<Faculty> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Faculties/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update faculty');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating faculty:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Faculties/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete faculty');
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      throw error;
    }
  }
}

export const facultiesApi = new FacultiesService();
export type { Faculty };
