import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Line } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';
import { EmptyStateMessage } from './EmptyStateMessage';

interface PerformanceData {
  month: string;
  value: number;
}

interface PerformanceViewProps {
  accountId: string;
  hasFunds: boolean;
  hasData?: boolean;
}

const monthlyData: PerformanceData[] = [
  { month: 'ABR 2025', value: -5.36 },
  { month: 'MAR 2025', value: -4.03 },
  { month: 'FEB 2025', value: -2.11 },
  { month: 'ENE 2025', value: 3.34 },
  { month: 'DIC 2024', value: -1.3 },
  { month: 'NOV 2024', value: 3.69 },
  { month: 'OCT 2024', value: -1.33 },
  { month: 'SEP 2024', value: 5.71 },
  { month: 'AGO 2024', value: 3.25 },
  { month: 'JUL 2024', value: 2.31 },
];

const historicalDataByYear = {
  '2024': [
    { date: '2024-07', value: 2.31 },
    { date: '2024-08', value: 3.25 },
    { date: '2024-09', value: 5.71 },
    { date: '2024-10', value: -1.33 },
    { date: '2024-11', value: 3.69 },
    { date: '2024-12', value: -1.3 },
  ],
  '2025': [
    { date: '2025-01', value: 3.34 },
    { date: '2025-02', value: -2.11 },
    { date: '2025-03', value: -4.03 },
    { date: '2025-04', value: -5.36 },
  ]
};

const historicalDataByPeriod = {
  '6M': [
    { date: '2024-11', value: 3.69 },
    { date: '2024-12', value: 2.39 },
    { date: '2025-01', value: 5.73 },
    { date: '2025-02', value: 3.62 },
    { date: '2025-03', value: -0.41 },
    { date: '2025-04', value: -5.36 },
  ],
  '1Y': [
    { date: '2024-05', value: 1.25 },
    { date: '2024-06', value: 2.31 },
    { date: '2024-07', value: 3.25 },
    { date: '2024-08', value: 5.71 },
    { date: '2024-09', value: 4.38 },
    { date: '2024-10', value: 7.82 },
    { date: '2024-11', value: 6.52 },
    { date: '2024-12', value: 9.86 },
    { date: '2025-01', value: 7.95 },
    { date: '2025-02', value: 4.92 },
    { date: '2025-03', value: -0.41 },
    { date: '2025-04', value: -5.36 },
  ],
  'inception': [
    { date: '2024-01', value: 0 },
    { date: '2024-02', value: 1.52 },
    { date: '2024-03', value: 2.83 },
    { date: '2024-04', value: 3.91 },
    { date: '2024-05', value: 1.25 },
    { date: '2024-06', value: 2.31 },
    { date: '2024-07', value: 3.25 },
    { date: '2024-08', value: 5.71 },
    { date: '2024-09', value: 4.38 },
    { date: '2024-10', value: 7.82 },
    { date: '2024-11', value: 6.52 },
    { date: '2024-12', value: 9.86 },
    { date: '2025-01', value: 7.95 },
    { date: '2025-02', value: 4.92 },
    { date: '2025-03', value: -0.41 },
    { date: '2025-04', value: -5.36 },
  ],
};

const formatDateToMMYYYY = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  return `${month}-${year}`;
};

// Get available years from inception date
const getAvailableYears = () => {
  const startDate = new Date('2024-07-01'); // Account opening date
  const endDate = new Date();
  const years: number[] = [];
  
  for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
    years.push(year);
  }
  
  return years.reverse(); // Most recent first
};

export function PerformanceView({ accountId, hasFunds, hasData = true }: PerformanceViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('inception');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const availableYears = getAvailableYears();

  if (!hasFunds) {
    return <EmptyStateMessage type="performance" />;
  }

  if (!hasData) {
    return <EmptyStateMessage type="performance" />;
  }

  const barChartData = {
    labels: [
      t('performance.periods.month'),
      t('performance.periods.quarter'),
      t('performance.periods.ytd'),
      t('performance.periods.inception')
    ],
    datasets: [
      {
        data: [-5.36, -5.21, -8.1, -2.06],
        backgroundColor: `rgba(${colorTheme.colors.primaryRgb}, 0.8)`,
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 8,
        displayColors: false,
        callbacks: {
          title: () => '',
          label: (context: any) => {
            const value = context.raw;
            const label = context.label;
            return `${label}: ${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme => theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: number) => `${value}%`,
          color: theme => theme.dark ? '#9CA3AF' : '#4B5563',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme => theme.dark ? '#9CA3AF' : '#4B5563',
        },
      },
    },
  };

  // Get data based on selected period or year
  const getChartData = () => {
    if (selectedPeriod === 'year') {
      return historicalDataByYear[selectedYear.toString()] || [];
    }
    return historicalDataByPeriod[selectedPeriod];
  };

  const currentData = getChartData();

  const lineChartData = {
    labels: currentData.map(d => formatDateToMMYYYY(d.date)),
    datasets: [
      {
        label: t('performance.return'),
        data: currentData.map(d => d.value),
        borderColor: `rgba(${colorTheme.colors.primaryRgb}, 1)`,
        backgroundColor: `rgba(${colorTheme.colors.primaryRgb}, 0.2)`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => {
            const value = context.raw;
            return `Rendimiento: ${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        grid: {
          color: theme => theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: number) => `${value}%`,
          color: theme => theme.dark ? '#9CA3AF' : '#4B5563',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme => theme.dark ? '#9CA3AF' : '#4B5563',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  // Filter monthly data by selected year
  const filteredMonthlyData = monthlyData.filter(data => {
    const [, year] = data.month.split(' ');
    return parseInt(year) === selectedYear;
  });

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">
            {t('performance.netGains')}
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">-$307.08</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-sm text-gray-900 dark:text-white">{t('performance.totalReturn')}</span>
            <span className="text-sm text-red-600 dark:text-red-400">-2.06%</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('performance.lastUpdate')} 2025-04-11 UTC
          </p>
        </div>
        <div className="h-64">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Historical Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('performance.title')}
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            {[
              { label: '6M', value: '6M' },
              { label: '1Y', value: '1Y' },
              { label: t('performance.periods.inception'), value: 'inception' },
              { label: t('performance.periods.year'), value: 'year' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`flex-1 sm:flex-none px-3 py-1 text-sm rounded transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-theme-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {period.label}
              </button>
            ))}
            {selectedPeriod === 'year' && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="h-64 mb-6">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('performance.monthlyReturn')}
          </h4>
          <div className="space-y-4">
            {filteredMonthlyData.map((data) => (
              <div
                key={data.month}
                className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
              >
                <span className="text-sm text-gray-600 dark:text-gray-300">{data.month}</span>
                <span className={`text-sm font-medium ${
                  data.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {data.value > 0 ? '+' : ''}{data.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}