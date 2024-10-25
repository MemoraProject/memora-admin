'use client';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { monthlyUserGrowthStatistics } from '@/api/user';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserStatistics {
  date: string;
  newUsers: number;
  totalUsers: number;
}

interface UserChartProps {
  months: number;
}

const UserChart: React.FC<UserChartProps> = ({ months }) => {
  const [statistics, setStatistics] = useState<UserStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await monthlyUserGrowthStatistics(months);
     
       
        const data: UserStatistics[] = response
 
        setStatistics(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [months]);

  const options = {
    // ... (giữ nguyên các tùy chọn hiện có)
  };

  const labels = statistics.map(stat => new Date(stat.date).toLocaleString('default', { month: 'short' }));
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Users',
        data: statistics.map(stat => stat.totalUsers),
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'New Users',
        data: statistics.map(stat => stat.newUsers),
        backgroundColor: 'rgb(173, 216, 230)',
      },
    ],
  };

  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      {statistics.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <p>Không có dữ liệu để hiển thị.</p>
      )}
    </div>
  );
};

export default UserChart;