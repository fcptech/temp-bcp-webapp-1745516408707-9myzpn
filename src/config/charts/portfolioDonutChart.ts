import { ChartOptions } from 'chart.js';

export const mockAssetClasses = [
  { name: 'Stocks', percentage: 85, color: `rgba(var(--color-primary-rgb), 1)` },
  { name: 'Bonds', percentage: 10, color: `rgba(var(--color-secondary-rgb), 1)` },
  { name: 'Cash', percentage: 5, color: `rgba(var(--color-accent-rgb), 1)` }
];

export const portfolioDonutData = {
  labels: mockAssetClasses.map(asset => asset.name),
  datasets: [
    {
      data: mockAssetClasses.map(asset => asset.percentage),
      backgroundColor: mockAssetClasses.map(asset => asset.color),
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
};

export const portfolioDonutOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      padding: 12,
      displayColors: true,
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.raw || 0;
          return ` ${label}: ${value}%`;
        },
        labelColor: function(context: any) {
          return {
            backgroundColor: mockAssetClasses[context.dataIndex].color,
            borderColor: mockAssetClasses[context.dataIndex].color,
          };
        },
      },
    },
  },
  cutout: '70%',
  elements: {
    arc: {
      borderWidth: 0,
      hoverBorderWidth: 0,
    },
  },
  hover: {
    mode: 'nearest',
    intersect: true,
  },
  layout: {
    padding: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    }
  }
};