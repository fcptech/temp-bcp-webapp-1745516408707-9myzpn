import { z } from 'zod';

export const AccountTypeEnum = z.enum(['AUTOMATED_INVESTMENT', 'MARKET_HUB']);
export type AccountType = z.infer<typeof AccountTypeEnum>;

export const InstrumentSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  sector: z.string().optional(),
  price: z.number(),
  quantity: z.number(),
  value: z.number(),
  performance: z.number(),
  logoUrl: z.string().optional(),
});

export type Instrument = z.infer<typeof InstrumentSchema>;

export const AccountSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: AccountTypeEnum,
  value: z.number(),
  percentage: z.number(),
  buyingPower: z.number().optional(),
  funded: z.boolean(),
  performance: z.object({
    total: z.number(),
    percentage: z.number(),
    period: z.string()
  })
});

export type Account = z.infer<typeof AccountSchema>;

export type WithdrawalAccountStatus = 'active' | 'pending_review' | 'pending_client_approval' | 'approval_in_progress' | 'accepted';

export const WithdrawalAccountSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: z.enum(['bank', 'financial']),
  accountNumber: z.string(),
  status: z.enum(['active', 'pending_review', 'pending_client_approval', 'approval_in_progress', 'accepted']),
  country: z.string(),
  currency: z.string(),
  routingNumber: z.string().optional(),
  approvalUrl: z.string().optional()
});

export type WithdrawalAccount = z.infer<typeof WithdrawalAccountSchema>;