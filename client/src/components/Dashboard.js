import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Charts from './Charts';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExportButtons from './ExportButtons';

function Dashboard({ token, setToken, theme, user }) {
  const [expenses, setExpenses] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(); //  Chart container ref

  const fetchExpenses = async () => {
    const res = await axios.get('https://expense-tracker-68qa.onrender.com/api/expenses', {
      headers: { Authorization: token }
    });
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // 💰 Calculations
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div>
      {/* 👋 Welcome & Actions */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="fw-bold text-primary m-0">
          👋 Welcome{user?.name ? `, ${user.name}` : ''}!
        </h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={() => setShowChart(!showChart)}>
            {showChart ? 'Hide Report 📉' : 'Show Report 📊'}
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* 💳 Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card text-white bg-success shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Total Income</h6>
              <h3 className="fw-bold">₹ {totalIncome}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card text-white bg-danger shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Total Expense</h6>
              <h3 className="fw-bold">₹ {totalExpense}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-lg-4">
          <div className="card text-white bg-primary shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Balance</h6>
              <h3 className="fw-bold">₹ {balance}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 💡 Form, List, Charts, Export */}
      <ExpenseForm token={token} onAdd={fetchExpenses} />
      <ExpenseList expenses={expenses} token={token} onDelete={fetchExpenses} />

      {showChart && <Charts expenses={expenses} ref={chartRef} />}
      <ExportButtons expenses={expenses} chartRef={chartRef} />
    </div>
  );
}

export default Dashboard;
