import React, { createContext, useContext, useState } from 'react';

interface WidgetAuthContextType {
  isAuthenticated: boolean;
  permissions: string[];
  accountId?: string;
  error?: string;
}

const WidgetAuthContext = createContext<WidgetAuthContextType | undefined>(undefined);

export function WidgetAuthProvider({ 
  children,
  token,
  domain 
}: { 
  children: React.ReactNode;
  token?: string;
  domain?: string;
}) {
  // For development, always authenticate
  const [auth] = useState({
    isAuthenticated: true,
    permissions: ['read:all'],
    accountId: undefined
  });

  return (
    <WidgetAuthContext.Provider value={{
      isAuthenticated: auth.isAuthenticated,
      permissions: auth.permissions,
      accountId: auth.accountId,
      error: undefined
    }}>
      {children}
    </WidgetAuthContext.Provider>
  );
}

export function useWidgetAuth() {
  const context = useContext(WidgetAuthContext);
  if (context === undefined) {
    throw new Error('useWidgetAuth must be used within a WidgetAuthProvider');
  }
  return context;
}