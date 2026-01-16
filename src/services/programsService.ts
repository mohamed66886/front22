import type { Program } from '@/types/api';

class ProgramsService {
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

  async getAll(skipAuth: boolean = false): Promise<Program[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Programs`, {
        method: 'GET',
        headers: this.getAuthHeaders(skipAuth),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Program> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Programs/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch program');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching program:', error);
      throw error;
    }
  }

  async getByFacultyId(facultyId: number, skipAuth: boolean = false): Promise<Program[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Programs/faculty/${facultyId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(skipAuth),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch programs by faculty');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching programs by faculty:', error);
      throw error;
    }
  }

  async getByFacultyAndType(facultyId: number, programType: number, skipAuth: boolean = false): Promise<Program[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Programs/faculty/${facultyId}/type/${programType}`, {
        method: 'GET',
        headers: this.getAuthHeaders(skipAuth),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch programs by faculty and type');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching programs by faculty and type:', error);
      throw error;
    }
  }

  async create(data: Omit<Program, 'program_id'>): Promise<Program> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Programs`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create program');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<Program>): Promise<Program> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Programs/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update program');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Programs/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }
}

export const programsApi = new ProgramsService();
export type { Program };
