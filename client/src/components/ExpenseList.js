import axios from 'axios';
import React, { useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaTrashAlt
} from 'react-icons/fa';
import './ExpenseList.css';

function ExpenseList({ expenses, token, onDelete }) {
  const [filter, setFilter] = useState('all');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await axios.delete(`https://expense-tracker-68qa.onrender.com/api/expenses/${id}`, {
        headers: { Authorization: token },
      });
      onDelete();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filtered = filter === 'all' ? expenses : expenses.filter(e => e.type === filter);

  return (
    <div className="card shadow-sm p-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="fw-bold mb-0">📋 Transaction History</h5>
        <div className="btn-group">
          <button className={`btn btn-outline-dark ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`btn btn-outline-success ${filter === 'income' ? 'active' : ''}`} onClick={() => setFilter('income')}>Income</button>
          <button className={`btn btn-outline-danger ${filter === 'expense' ? 'active' : ''}`} onClick={() => setFilter('expense')}>Expense</button>
        </div>
      </div>

      <ul className="list-group list-group-flush">
        {filtered.length === 0 && <li className="list-group-item text-center text-muted">No transactions yet.</li>}
        {filtered.map((item) => (
          <li
            key={item._id}
            className={`list-group-item d-flex justify-content-between align-items-center expense-item fade-in border-0 rounded shadow-sm mb-2 ${
              item.type === 'income' ? 'bg-light-green' : 'bg-light-red'
            }`}
          >
            <div className="d-flex align-items-center gap-3">
              <span className="fs-5">
                {item.type === 'income' ? <FaArrowDown className="text-success" /> : <FaArrowUp className="text-danger" />}
              </span>
              <div>
                <div className="fw-bold">{item.title}</div>
                <div className="small text-muted text-capitalize">{item.type}</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className={`badge fs-6 ${item.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                ₹ {item.amount}
              </span>
              <FaTrashAlt role="button" className="text-danger fs-5" onClick={() => handleDelete(item._id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
