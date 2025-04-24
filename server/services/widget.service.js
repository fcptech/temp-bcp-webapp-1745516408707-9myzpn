import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import { UAParser } from 'ua-parser-js';

class WidgetService {
  static async validateToken(token, origin) {
    try {
      // 1. Verify token signature and expiration
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // 2. Check if token is for widget usage
      if (payload.type !== 'widget') {
        throw new Error('Invalid token type');
      }

      // 3. Validate domain
      if (payload.domain !== origin) {
        throw new Error('Domain mismatch');
      }

      // 4. Check if client is active
      const client = await this.getClient(payload.clientId);
      if (!client || !client.active) {
        throw new Error('Invalid or inactive client');
      }

      return {
        valid: true,
        clientId: payload.clientId,
        permissions: payload.permissions
      };
    } catch (error) {
      logger.error('Widget token validation failed:', error);
      return { valid: false };
    }
  }

  static async generateToken(clientId, domain, permissions = []) {
    try {
      // 1. Verify client exists and is active
      const client = await this.getClient(clientId);
      if (!client || !client.active) {
        throw new Error('Invalid or inactive client');
      }

      // 2. Validate domain is authorized
      const isDomainValid = await this.validateDomain(domain, clientId);
      if (!isDomainValid) {
        throw new Error('Unauthorized domain');
      }

      // 3. Generate token
      const token = jwt.sign(
        {
          type: 'widget',
          clientId,
          domain,
          permissions,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
        },
        process.env.JWT_SECRET
      );

      return { token };
    } catch (error) {
      logger.error('Widget token generation failed:', error);
      throw error;
    }
  }

  static async validateDomain(domain, clientId) {
    try {
      // Get authorized domains for client
      const client = await this.getClient(clientId);
      if (!client) return false;

      // Check if domain is in authorized list
      return client.authorizedDomains.some(d => {
        // Support wildcard subdomains
        if (d.startsWith('*.')) {
          const baseDomain = d.slice(2);
          return domain.endsWith(baseDomain);
        }
        return d === domain;
      });
    } catch (error) {
      logger.error('Domain validation failed:', error);
      return false;
    }
  }

  // Mock client data - In production, this would be a database call
  static async getClient(clientId) {
    const mockClients = {
      'client_123': {
        id: 'client_123',
        name: 'Test Client',
        active: true,
        authorizedDomains: [
          'localhost:5173',
          '*.netlify.app'
        ]
      }
    };

    return mockClients[clientId];
  }
}

export default WidgetService;