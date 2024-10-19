'use client';
import styles from './UserActivityHeatmap.module.css';
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Legend, ChartArea, ChartOptions, ScriptableContext, TooltipItem } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

ChartJS.register(CategoryScale, LinearScale, Tooltip, Legend, MatrixController, MatrixElement);

const UserActivityHeatmap: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const data = {
    datasets: [{
      label: 'User Activity',
      data: days.flatMap((day) => 
        hours.map((hour) => ({
          x: day,
          y: hour,
          v: Math.floor(Math.random() * 200) // Replace with actual data
        }))
      ),
      width: ({ chart }: { chart: ChartJS }) => ((chart.chartArea as ChartArea)?.width ?? 0) / 7 - 1,
      height: ({ chart }: { chart: ChartJS }) => ((chart.chartArea as ChartArea)?.height ?? 0) / 24 - 1,
      backgroundColor: (ctx: ScriptableContext<"matrix">) => {
        const value = (ctx.raw as { v: number }).v;
        const alpha = Math.min(value / 200, 1); // Adjust 200 based on your max value
        return `rgba(54, 162, 235, ${alpha})`;
      },
    }]
  };

  const options: ChartOptions<'matrix'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'category' as const,
        labels: hours,
        offset: true,
        reverse: true,
        ticks: {
          align: 'start' as const,
        },
        grid: {
          display: false,
        },
      },
      x: {
        type: 'category' as const,
        labels: days,
        offset: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any[]) => 
            context[0] ? `${context[0].raw.x}, ${context[0].raw.y}` : '',
          label: (context: TooltipItem<"matrix">) => {
            const value = (context.raw as { v: number })?.v;
            return `Users: ${value ?? 'N/A'}`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.heatmapContainer}>
      <h2>USERS BY TIME OF DAY</h2>
      <div className={styles.chartWrapper}>
        <Chart type="matrix" options={options} data={data} />
      </div>
    </div>
  );
};

export default UserActivityHeatmap;