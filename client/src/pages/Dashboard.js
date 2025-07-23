import { useState, useEffect, useContext } from 'react';
import { Grid, Typography, Paper, Box } from '@mui/material';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import GoalForm from '../components/goals/GoalForm';
import GoalList from '../components/goals/GoalList';
import ExpenseChart from '../components/charts/ExpenseChart';
import SavingsChart from '../components/charts/SavingsChart';
import AuthContext from '../context/authContext';
import expenseAPI from '../api/expenses';
import goalAPI from '../api/goals';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, goalsRes] = await Promise.all([
          expenseAPI.getExpenses(token),
          goalAPI.getGoals(token)
        ]);
        setExpenses(expensesRes);
        setGoals(goalsRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleAddExpense = async (expenseData) => {
    try {
      const newExpense = await expenseAPI.createExpense(expenseData, token);
      setExpenses([newExpense, ...expenses]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGoal = async (goalData) => {
    try {
      const newGoal = await goalAPI.createGoal(goalData, token);
      setGoals([...goals, newGoal]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseAPI.deleteExpense(id, token);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await goalAPI.deleteGoal(id, token);
      setGoals(goals.filter(goal => goal._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.email}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Expenses Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Expense
            </Typography>
            <ExpenseForm token={token} onExpenseAdded={handleAddExpense} />
          </Paper>
          
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Expenses
            </Typography>
            <ExpenseList 
              expenses={expenses} 
              onDelete={handleDeleteExpense} 
              onEdit={(id) => console.log('Edit:', id)} 
            />
          </Paper>
        </Grid>

        {/* Goals Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Savings Goal
            </Typography>
            <GoalForm token={token} onGoalAdded={handleAddGoal} />
          </Paper>
          
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Goals
            </Typography>
            <GoalList 
              goals={goals} 
              onDelete={handleDeleteGoal} 
              onEdit={(id) => console.log('Edit:', id)} 
            />
          </Paper>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Expense Breakdown
            </Typography>
            <ExpenseChart expenses={expenses} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Savings Progress
            </Typography>
            <SavingsChart goals={goals} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;