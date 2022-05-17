import React, { useEffect } from 'react';
import { Chart as ChartJS } from 'react-chartjs-2';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import ChartStreaming from 'chartjs-plugin-streaming';
import { alpha, Box } from '@mui/material';

import { RQuery } from 'rethinkdb-ts/lib/query-builder/query';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import { lightTheme } from '../theme';
import { system_db, useLatestChange } from '../rethinkdb';

import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

Chart.register(ChartStreaming);

const options: ChartOptions<'line'> = {
  aspectRatio: 5,
  scales: {
    x: {
      type: 'realtime',
      realtime: {
        delay: 1500,
        duration: 120000,
        frameRate: 60,
      },
      ticks: {
        maxRotation: 0,
        minRotation: 0,
        maxTicksLimit: 30,
        source: 'auto',
        autoSkip: true,
        callback: function (value) {
          return value;
        },
      },
    },
    y: {
      ticks: {
        maxTicksLimit: 10,
      },
      min: 0,
    },
  },
};

export type ChangesResult = {
  keysRead: number;
  keysSet: number;
};

const changesQuery = r
  .db(system_db)
  .table('stats')
  .get(['cluster'])
  .changes()
  .map((stat: RQuery) => ({
    keysRead: stat('new_val')('query_engine')('read_docs_per_sec'),
    keysSet: stat('new_val')('query_engine')('written_docs_per_sec'),
  }));

const useData = () =>
  React.useRef<ChartData<'line'>>({
    datasets: [
      {
        label: 'Reads',
        fill: false,
        data: [],
        borderColor: lightTheme.palette.primary.main,
        backgroundColor: alpha(lightTheme.palette.primary.light, 0.7),
        pointStyle: 'line',
      },
      {
        label: 'Writes',
        fill: false,
        data: [],
        borderColor: lightTheme.palette.secondary.main,
        backgroundColor: alpha(lightTheme.palette.secondary.light, 0.7),
        pointStyle: 'line',
      },
    ],
  });

export const LineChart = () => {
  const data = useData();
  const [latestData] = useLatestChange<ChangesResult>(changesQuery);

  useEffect(() => {
    if (data.current?.datasets[0].data) {
      const date = +new Date();
      data.current.datasets[0].data.push({
        x: date,
        y: latestData?.keysRead,
      });
      data.current.datasets[1].data.push({
        x: date,
        y: latestData?.keysSet,
      });
    }
  }, [latestData]);

  return (
    <Box>
      <ChartJS type="line" data={data.current} options={options} />
    </Box>
  );
};
