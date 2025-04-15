import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ChartProfile = ({ won, lost, draw }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const winPercentage = () => {
    const percentage = (won * 100) / (won + draw + lost);
    return percentage.toFixed(2);
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(myChartRef, {
      type: 'doughnut',
      data: {
        labels: ['Won', 'Lost', 'Draw'],
        datasets: [
          {
            label: 'Games Status',
            data: [won, lost, draw],
            backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: '#fff',
            },
            position: 'top',
          },
        },
        maintainAspectRatio: false,
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <canvas ref={chartRef} />
      <h2 style={{ textAlign: 'center', marginTop: '15px' }}>{winPercentage()}%</h2>
    </>
  );
};

export default ChartProfile;
