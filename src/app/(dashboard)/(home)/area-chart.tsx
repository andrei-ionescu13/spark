'use client';

import { useTheme } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

interface AreaChartProps {}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const getMonths = () => {
  return [...Array(12).keys()].map((i) =>
    new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(0, i))
  );
};

export const AreaChart: FC<AreaChartProps> = (props) => {
  const {} = props;
  const theme = useTheme();
  const series = [
    {
      name: 'Total income',
      data: [...Array(12).keys()].map(() => getRandomInt(1000)),
    },
    {
      name: 'Total expenses',
      data: [...Array(12).keys()].map(() => getRandomInt(1000)),
    },
  ];
  // apexcharts-tooltip apexcharts-theme-light
  const options: ApexOptions = {
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    grid: {
      borderColor: theme.palette.divider,
    },
    tooltip: {
      theme: undefined,
    },
    legend: {
      show: false,
    },
    chart: {
      toolbar: {
        show: false,
      },
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
      axisBorder: {
        color: theme.palette.divider,
      },
      axisTicks: {
        show: false,
      },
      categories: getMonths(),
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={300}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};
