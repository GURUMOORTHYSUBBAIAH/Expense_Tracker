// server/models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  amount: Number,
  category: String,
  type: { type: String, enum: ['income', 'expense'], default: 'expense' },
  date: { type: Date, default: Date.now },
  note: String
});

module.exports = mongoose.model('Expense', ExpenseSchema);
