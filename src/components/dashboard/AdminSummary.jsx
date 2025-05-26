// frontend/src/components/dashboard/AdminSummary.jsx
import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard';
import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaTimesCircle, FaUsers, FaChartBar } from 'react-icons/fa';
import axios from 'axios';

// Import Pie and Bar charts and necessary Chart.js components
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register all necessary Chart.js components for both Pie and Bar charts
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://backems-production.up.railway.app/api/dashboard/summary', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSummary(response.data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        }
        console.log("Error fetching summary:", error.message);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='text-xl font-semibold text-gray-700'>Loading dashboard data...</div>
        </div>
    );
  }

  // --- Data & Options for Leave Details Pie Chart ---
  const leavePieData = {
    labels: ['Applied', 'Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          summary.leaveSummary.appliedFor,
          summary.leaveSummary.approved,
          summary.leaveSummary.pending,
          summary.leaveSummary.rejected,
        ],
        backgroundColor: [
          '#2F855A', // Dark Green for Applied (similar to teal-600)
          '#38A169', // Medium Green for Approved (similar to green-600)
          '#D69E2E', // Amber for Pending (similar to yellow-600)
          '#E53E3E', // Red for Rejected (similar to red-600)
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const leavePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Leave Status Distribution',
        font: { size: 20, weight: 'bold', color: '#333' },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) label += ': ';
            if (context.parsed !== null) {
              const totalLeaves = leavePieData.datasets[0].data.reduce((a, b) => a + b, 0);
              label += context.parsed + (totalLeaves > 0 ? ` (${((context.parsed / totalLeaves) * 100).toFixed(1)}%)` : '');
            }
            return label;
          }
        }
      }
    },
    layout: {
      padding: { left: 10, right: 10, top: 10, bottom: 10 }
    }
  };

  // --- Data & Options for Employee Distribution Bar Chart ---
  // Using actual data if available, otherwise fallback to placeholder
  const employeeDeptLabels = summary.employeeDistributionByDepartment && summary.employeeDistributionByDepartment.length > 0
    ? summary.employeeDistributionByDepartment.map(d => d.departmentName)
    : ['HR', 'Sales', 'Marketing', 'Engineering'];
  const employeeDeptCounts = summary.employeeDistributionByDepartment && summary.employeeDistributionByDepartment.length > 0
    ? summary.employeeDistributionByDepartment.map(d => d.employeeCount)
    : [30, 45, 20, 50]; // Fallback placeholder data

  const employeeBarData = {
    labels: employeeDeptLabels,
    datasets: [
      {
        label: 'Number of Employees',
        data: employeeDeptCounts,
        backgroundColor: [
            '#065F46', // Darker Teal
            '#10B981', // Emerald
            '#F59E0B', // Amber
            '#EF4444', // Red
            '#3B82F6', // Blue
            '#8B5CF6', // Violet
        ],
        borderColor: [
            '#064E3B',
            '#059669',
            '#D97706',
            '#B91C1C',
            '#2563EB',
            '#6D28D9',
        ],
        borderWidth: 1,
      },
    ],
  };

  const employeeBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Employee Distribution by Department',
        font: { size: 20, weight: 'bold', color: '#333' },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} Employees`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Department',
          font: { size: 14 }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Number of Employees',
          font: { size: 14 }
        }
      },
    },
  };


  return (
    <div className='p-6'>
      {/* Dashboard Overview Cards */}
      <h3 className='text-2xl font-bold text-gray-800 mb-6'>Dashboard Overview</h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <SummaryCard
          icon={<FaUsers />}
          text="Total Employee"
          number={summary.totalEmployees}
          color="bg-teal-600"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summary.totalDepartments}
          color="bg-yellow-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Monthly Salary"
          number={summary.totalSalary}
          color="bg-red-600"
        />
      </div>

      {/* Leave Details Section (Cards + Pie Chart) */}
      <div className='mt-12'>
        <h3 className='text-center text-2xl font-bold text-gray-800 mb-8'>Leave Details</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <SummaryCard icon={<FaFileAlt />} text="Leave Applied" number={summary.leaveSummary.appliedFor} color="bg-teal-600" />
          <SummaryCard icon={<FaCheckCircle />} text="Leave Approved" number={summary.leaveSummary.approved} color="bg-green-600" />
          <SummaryCard icon={<FaHourglassHalf />} text="Leave Pending" number={summary.leaveSummary.pending} color="bg-yellow-600" />
          <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={summary.leaveSummary.rejected} color="bg-red-600" />
        </div>

        {/* Existing Pie Chart for Leave Details */}
        <div className='mt-8 bg-white p-6 rounded-lg shadow-lg flex justify-center items-center' style={{ height: '400px' }}>
          <div className='w-full max-w-xl h-full'>
            <Pie data={leavePieData} options={leavePieOptions} />
          </div>
        </div>
      </div>

      {/* NEW: Employee Data Visualization Section (Bar Chart) */}
      <div className='mt-12'>
        <h3 className='text-center text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center'>
            <FaChartBar className='mr-3 text-blue-600' /> Employee Insights
        </h3>
        <div className='bg-white p-6 rounded-lg shadow-lg flex justify-center items-center' style={{ height: '450px' }}>
          <div className='w-full max-w-2xl h-full'>
            <Bar data={employeeBarData} options={employeeBarOptions} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminSummary;