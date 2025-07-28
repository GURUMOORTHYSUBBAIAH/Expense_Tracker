import axios from 'axios';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // optional icon

function ExpenseForm({ token, onAdd }) {
  const [formData, setFormData] = useState({ title: '', amount: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.type) {
      return alert("All fields are required");
    }

    try {
      await axios.post('https://expense-tracker-68qa.onrender.com/api/expenses', formData, {
        headers: { Authorization: token }
      });
      setFormData({ title: '', amount: '', type: '' });
      onAdd(); // Refresh expense list
      document.querySelector('#expenseModal .btn-close')?.click(); // Close modal
    } catch (err) {
      alert('Failed to add transaction');
      console.error(err);
    }
  };

  return (
    <div>
      {/* Trigger Button */}
      <div className="text-end mb-3">
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#expenseModal"
        >
          <FaPlus /> Add Transaction
        </button>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="expenseModal"
        tabIndex="-1"
        aria-labelledby="expenseModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <form onSubmit={handleSubmit} className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="expenseModalLabel">Add New Transaction</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Salary, Grocery"
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Transaction Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExpenseForm;
