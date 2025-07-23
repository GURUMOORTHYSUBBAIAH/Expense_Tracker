import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';
import React, { forwardRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import './Charts.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Charts = forwardRef(({ expenses }, ref) => {
  const income = expenses.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = expenses.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  const labels = ['Income', 'Expense', 'Balance'];
  const dataValues = [income, expense, balance];

  const data = {
    labels,
    datasets: [
      {
        label: 'Amount',
        data: dataValues,
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="card p-4 shadow-sm mb-5" ref={ref}>
      <h5 className="fw-bold mb-4">📊 Expense Overview (All Charts)</h5>
      <div className="row g-4">
        <div className="col-md-4 col-12">
          <div className="chart-box shadow-sm p-3 rounded bg-light">
            <h6 className="text-center">Pie Chart</h6>
            <Pie data={data} />
          </div>
        </div>
        <div className="col-md-4 col-12">
          <div className="chart-box shadow-sm p-3 rounded bg-light">
            <h6 className="text-center">Bar Chart</h6>
            <Bar data={data} />
          </div>
        </div>
        <div className="col-md-4 col-12">
          <div className="chart-box shadow-sm p-3 rounded bg-light">
            <h6 className="text-center">Line Chart</h6>
            <Line data={data} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Charts;
