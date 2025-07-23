// server/controllers/expenseController.js
const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  const expense = new Expense({ ...req.body, userId: req.user });
  await expense.save();
  res.json(expense);
};

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ userId: req.user });
  res.json(expenses);
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  await Expense.findByIdAndDelete(id);
  res.json({ message: 'Expense deleted' });
};
