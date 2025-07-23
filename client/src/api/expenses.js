import axios from 'axios';

const API_URL = '/api/expenses';

const getExpenses = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const createExpense = async (expenseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, expenseData, config);
  return response.data;
};

const updateExpense = async (id, expenseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${id}`, expenseData, config);
  return response.data;
};

const deleteExpense = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

export default {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};