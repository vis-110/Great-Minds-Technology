import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { data } from 'autoprefixer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  // Data 1: Bar Chart
const [counts, setCounts] = useState({
  students: 0,
  trainers: 0,
  vendors: 0,
});

useEffect(() => {
  fetch('http://localhost:8000/admin_gmt/user-category-counts/')
    .then(res => res.json())
    .then(data => {
      setCounts({
        students: data.total_students || 0,
        trainers: data.total_approved_trainers || 0,
        vendors: data.total_approved_vendors || 0,
      });
    })
    .catch(() => {});
}, []);

const barData = {
  labels: ['Students', 'Approved Trainers', 'Approved Vendors'],
  datasets: [
    {
      label: 'Available',
      data: [counts.students, counts.trainers, counts.vendors],
      backgroundColor: ['#3f51b5', '#f50057', '#00c853'],
    },
  ],
};

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Dashboard Overview' },
    },
  };

  const [TrainerCounts, setTrainerCounts] = useState({
    approved : 0,
    rejected: 0,
    waiting: 0,
  });
  useEffect(() => {
    fetch('http://localhost:8000/admin_gmt/trainer-status-counts/')
      .then(res => res.json())
      .then(data => {
        setTrainerCounts({
          approved: data.approved_trainers || 0,
          rejected: data.rejected_trainers || 0,
          waiting: data.waiting_trainers || 0,
        });
        console.log(data)
      })
      .catch(() => {});
  }, []);
  // Data 2: Doughnut Chart for Activation
  const TrainerdoughnutData = {
    labels: ['Approved', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [TrainerCounts.approved, TrainerCounts.rejected, TrainerCounts.waiting],
        backgroundColor: ['#00c853', '#d32f2f', '#ff8a80'], // Green, Red, Light Red
        hoverOffset: 4,
      },
    ],
  };

  const[VendorCounts, setVendorCounts] = useState({
    approved: 0,
    rejected: 0,
    waiting: 0,
  });

  useEffect(() => {
    fetch('http://localhost:8000/admin_gmt/vendor-status-counts/')
      .then(res => res.json())
      .then(data => {
        setVendorCounts({
          approved: data.approved_vendors || 0,
          rejected: data.rejected_vendors || 0,
          waiting: data.waiting_vendors || 0,
        });
        console.log(data)
      })
      .catch(() => {});
  },[])

  const VendordoughnutData = {
    labels: ['Approved', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [VendorCounts.approved, VendorCounts.rejected, VendorCounts.waiting],  // You can change this to actual counts
        backgroundColor: ['#00c853', '#d32f2f', '#ff8a80'],
        hoverOffset: 4,
      },
    ],
  };

  const VendordoughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Vendor Activation Status',
      },
    },
  };
   const TrainerdoughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Trainer Activation Status',
      },
    },
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center min-h-screen p-8 bg-gray-50">
      {/* Charts Grid: 2 Bar charts + 2 Doughnut charts in a single row, smaller size */}
      <div className="flex flex-row gap-6 justify-center items-center w-full flex-wrap">
        {/* Bar Chart 1 */}
        <div className="bg-white shadow rounded-2xl flex justify-center items-center w-120 h-530 p-2">
          <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} style={{height: "300px"}} />
        </div>
        {/* Bar Chart 2 */}
        <div className="bg-white shadow rounded-2xl flex justify-center items-center w-86 h-506 p-2">
          <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false, plugins: { ...barOptions.plugins, title: { display: true, text: 'Another Overview' } } }} style={{height: "280px"}}  />
        </div>
        {/* Doughnut Chart 1 */}
        <div className="bg-white shadow rounded-2xl flex justify-center items-center w-64 h-116 p-2">
          <Doughnut data={TrainerdoughnutData} options={{ ...TrainerdoughnutOptions, maintainAspectRatio: false }}  style={{height: "300px", width: "310px"}}/>
        </div>
        {/* Doughnut Chart 2 */}
        <div className="bg-white shadow rounded-2xl flex justify-center items-center w-64 h-116 p-2">
        <Doughnut data={VendordoughnutData} options={{ ...VendordoughnutOptions, maintainAspectRatio: false }} style={{height: "300px", width: "310px"}} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
