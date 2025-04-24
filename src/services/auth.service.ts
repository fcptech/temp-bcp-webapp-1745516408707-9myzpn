import { api } from '../config/api';
import { z } from 'zod';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const resetRequestSchema = z.object({
  email: z.string().email(),
  recaptchaToken: z.string(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(12).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number and special character'
  ),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type ResetRequest = z.infer<typeof resetRequestSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;

export class AuthService {
  static async login(credentials: LoginCredentials) {
    try {
      loginSchema.parse(credentials);
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid credentials format');
      }
      throw error;
    }
  }

  static async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  static async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  static async requestPasswordReset(data: ResetRequest) {
    try {
      resetRequestSchema.parse(data);
      await api.post('/auth/reset-password/request', data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Invalid request format');
      }
      throw error;
    }
  }

  static async validateResetToken(token: string) {
    const response = await api.get(`/auth/reset-password/validate/${token}`);
    return response.data.valid;
  }

  static async resetPassword(data: ResetPassword) {
    try {
      resetPasswordSchema.parse(data);
      await api.post('/auth/reset-password/reset', data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }
}