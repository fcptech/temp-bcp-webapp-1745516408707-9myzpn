import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface Operator {
  id: string;
  name: string;
  appName: string;
  logoUrl: string;
  theme: ColorTheme;
}

interface ColorTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    primaryRgb: string;
    secondaryRgb: string;
    accentRgb: string;
  };
  logoBackground: 'white' | 'primary';
}

export const operators: Operator[] = [
  {
    id: 'vestiva',
    name: 'Vestiva',
    appName: 'Vestiva Investment Platform',
    logoUrl: 'https://example.com/vestiva-logo.png', // Replace with actual logo URL
    theme: {
      id: 'vestiva',
      name: 'Vestiva',
      colors: {
        primary: '#002060',
        secondary: '#003087',
        accent: '#0047BB',
        primaryRgb: '0, 32, 96',
        secondaryRgb: '0, 48, 135',
        accentRgb: '0, 71, 187',
      },
      logoBackground: 'white'
    }
  },
  {
    id: 'invex',
    name: 'Invex',
    appName: 'Invex Investments',
    logoUrl: 'https://example.com/invex-logo.png', // Replace with actual logo URL
    theme: {
      id: 'invex',
      name: 'Invex',
      colors: {
        primary: '#EF4444',
        secondary: '#DC2626',
        accent: '#B91C1C',
        primaryRgb: '239, 68, 68',
        secondaryRgb: '220, 38, 38',
        accentRgb: '185, 28, 28',
      },
      logoBackground: 'white'
    }
  }
];

export const colorThemes: ColorTheme[] = [
  {
    id: 'vestiva',
    name: 'Vestiva',
    colors: {
      primary: '#002060',
      secondary: '#003087',
      accent: '#0047BB',
      primaryRgb: '0, 32, 96',
      secondaryRgb: '0, 48, 135',
      accentRgb: '0, 71, 187',
    },
    logoBackground: 'white'
  },
  {
    id: 'invex',
    name: 'Invex',
    colors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#B91C1C',
      primaryRgb: '239, 68, 68',
      secondaryRgb: '220, 38, 38',
      accentRgb: '185, 28, 28',
    },
    logoBackground: 'white'
  },
  {
    id: 'dolarapp',
    name: 'DolarApp',
    colors: {
      primary: '#34D399',
      secondary: '#059669',
      accent: '#047857',
      primaryRgb: '52, 211, 153',
      secondaryRgb: '5, 150, 105',
      accentRgb: '4, 120, 87',
    },
    logoBackground: 'primary'
  },
  {
    id: 'azul',
    name: 'Azul',
    colors: {
      primary: '#60A5FA',
      secondary: '#3B82F6',
      accent: '#1D4ED8',
      primaryRgb: '96, 165, 250',
      secondaryRgb: '59, 130, 246',
      accentRgb: '29, 78, 216',
    },
    logoBackground: 'white'
  },
  {
    id: 'verde',
    name: 'Verde',
    colors: {
      primary: '#34D399',
      secondary: '#059669',
      accent: '#047857',
      primaryRgb: '52, 211, 153',
      secondaryRgb: '5, 150, 105',
      accentRgb: '4, 120, 87',
    },
    logoBackground: 'primary'
  },
  {
    id: 'purpura',
    name: 'Púrpura',
    colors: {
      primary: '#A78BFA',
      secondary: '#7C3AED',
      accent: '#6D28D9',
      primaryRgb: '167, 139, 250',
      secondaryRgb: '124, 58, 237',
      accentRgb: '109, 40, 217',
    },
    logoBackground: 'white'
  },
  {
    id: 'escala-grises',
    name: 'Escala de Grises',
    colors: {
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#374151',
      primaryRgb: '107, 114, 128',
      secondaryRgb: '75, 85, 99',
      accentRgb: '55, 65, 81',
    },
    logoBackground: 'white'
  },
  {
    id: 'negro-total',
    name: 'Negro Total',
    colors: {
      primary: '#1F2937',
      secondary: '#111827',
      accent: '#030712',
      primaryRgb: '31, 41, 55',
      secondaryRgb: '17, 24, 39',
      accentRgb: '3, 7, 18',
    },
    logoBackground: 'white'
  },
];

interface ThemeContextType {
  theme: Theme;
  operator: Operator;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (themeId: string) => void;
  setOperator: (operatorId: string) => void;
  toggleLogoBackground: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || initialTheme;
  });

  const [operator, setOperatorState] = useState<Operator>(() => {
    const savedOperator = localStorage.getItem('operator');
    return savedOperator ? JSON.parse(savedOperator) : operators[0];
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const savedColorTheme = localStorage.getItem('colorTheme');
    return savedColorTheme ? JSON.parse(savedColorTheme) : operator.theme;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('operator', JSON.stringify(operator));
    document.title = operator.appName;
  }, [operator]);

  useEffect(() => {
    localStorage.setItem('colorTheme', JSON.stringify(colorTheme));
    const root = document.documentElement;
    root.style.setProperty('--color-primary-rgb', colorTheme.colors.primaryRgb);
    root.style.setProperty('--color-secondary-rgb', colorTheme.colors.secondaryRgb);
    root.style.setProperty('--color-accent-rgb', colorTheme.colors.accentRgb);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSetColorTheme = (themeId: string) => {
    const newTheme = colorThemes.find(theme => theme.id === themeId);
    if (newTheme) {
      setColorTheme(newTheme);
    }
  };

  const handleSetOperator = (operatorId: string) => {
    const newOperator = operators.find(op => op.id === operatorId);
    if (newOperator) {
      setOperatorState(newOperator);
      setColorTheme(newOperator.theme);
    }
  };

  const toggleLogoBackground = () => {
    setColorTheme(prev => ({
      ...prev,
      logoBackground: prev.logoBackground === 'white' ? 'primary' : 'white'
    }));
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      operator,
      colorTheme, 
      toggleTheme, 
      setColorTheme: handleSetColorTheme,
      setOperator: handleSetOperator,
      toggleLogoBackground 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}