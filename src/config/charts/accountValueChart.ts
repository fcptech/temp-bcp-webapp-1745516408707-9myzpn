import { ChartOptions } from 'chart.js';

export const getAccountValueChartData = (colorTheme: any) => ({
  labels: Array.from({ length: 30 }, (_, i) => `2024-${String(i + 1).padStart(2, '0')}`),
  datasets: [
    {
      label: 'Portfolio Value',
      data: Array.from({ length: 30 }, () => 14000 + Math.random() * 2000),
      borderColor: `rgba(${colorTheme.colors.primaryRgb}, 1)`,
      backgroundColor: `rgba(${colorTheme.colors.primaryRgb}, 0.2)`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    },
  ],
});

export const accountValueChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          const value = context.raw || 0;
          return `$ ${value.toLocaleString()}`;
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
      beginAtZero: false,
      grid: {
        color: theme => theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: theme => theme.dark ? '#9CA3AF' : '#4B5563',
        callback: function(value) {
          return `$${Number(value).toLocaleString()}`;
        },
        maxTicksLimit: 6,
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: theme => theme.dark ? '#9CA3AF' : '#4B5563',
        maxTicksLimit: window.innerWidth < 640 ? 4 : 8,
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 20
    }
  }
};