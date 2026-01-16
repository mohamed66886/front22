import type { UserType } from '@/types/api';

class UserTypesService {
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

  async getAll(skipAuth: boolean = false): Promise<UserType[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/UserTypes`, {
        method: 'GET',
        headers: this.getAuthHeaders(skipAuth),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user types');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user types:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<UserType> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/UserTypes/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user type');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user type:', error);
      throw error;
    }
  }

  async create(data: Omit<UserType, 'userTypeId'>): Promise<UserType> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/UserTypes`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create user type');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user type:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<UserType>): Promise<UserType> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/UserTypes/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user type');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user type:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/UserTypes/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user type');
      }
    } catch (error) {
      console.error('Error deleting user type:', error);
      throw error;
    }
  }
}

export const userTypesApi = new UserTypesService();
export type { UserType };
