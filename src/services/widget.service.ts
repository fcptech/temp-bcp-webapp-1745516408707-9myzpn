import { api } from '../config/api';
import { z } from 'zod';

const widgetAuthSchema = z.object({
  token: z.string(),
  domain: z.string().url(),
  accountId: z.string().optional(),
  permissions: z.array(z.string())
});

export type WidgetAuth = z.infer<typeof widgetAuthSchema>;

export class WidgetService {
  static async validateToken(token: string) {
    const response = await api.post('/widgets/validate', { token });
    return widgetAuthSchema.parse(response.data);
  }

  static async validateDomain(domain: string) {
    try {
      const url = new URL(domain);
      const response = await api.get(`/widgets/domains/${url.hostname}`);
      return response.data.isValid;
    } catch {
      return false;
    }
  }
}