interface User {
  id: number;
  name: string;
  email: string;
  userTypeId: number;
  universityId?: number;
  facultyId?: number;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  userTypeId: number;
  universityId?: number;
}

class AuthService {
  private readonly API_BASE_URL = 'http://localhost:5000/api';

  async register(data: RegisterData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('فشل في إنشاء الحساب. حاول مرة أخرى.');
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: User }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('فشل في تسجيل الدخول');
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authApi = new AuthService();
