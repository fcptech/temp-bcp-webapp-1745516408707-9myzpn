import { ChartOptions } from 'chart.js';

export const getDashboardChartData = (colorTheme: any) => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Total',
      data: [25000, 26500, 28000, 27500, 29500, 29385.84],
      borderColor: `rgba(${colorTheme.colors.primaryRgb}, 1)`,
      backgroundColor: `rgba(${colorTheme.colors.primaryRgb}, 0.2)`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Joaco',
      data: [12500, 13000, 14000, 13750, 14750, 14692.92],
      borderColor: `rgba(${colorTheme.colors.secondaryRgb}, 1)`,
      backgroundColor: `rgba(${colorTheme.colors.secondaryRgb}, 0.2)`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      hidden: true
    },
    {
      label: 'Manu',
      data: [12500, 13000, 14000, 13750, 14750, 14692.92],
      borderColor: `rgba(${colorTheme.colors.accentRgb}, 1)`,
      backgroundColor: `rgba(${colorTheme.colors.accentRgb}, 0.2)`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      hidden: true
    }
  ],
});

export const dashboardChartOptions: ChartOptions = {
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
      displayColors: true,
      callbacks: {
        title: function(context: any) {
          return context[0].label;
        },
        label: function(context: any) {
          const value = context.raw || 0;
          return `${context.dataset.label}: $ ${value.toLocaleString()}`;
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
      display: false,
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  }
};