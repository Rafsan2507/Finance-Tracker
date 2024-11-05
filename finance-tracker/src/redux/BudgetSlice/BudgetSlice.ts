import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Budget {
  id?: string;
  userId: string;
  category: string;
  budget: number;
  date: Date;
}

export interface BudgetState {
  budgets: Partial<Budget>[];
}

const initialState: BudgetState = {
  budgets: [],
};

export const BudgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      addBudget.fulfilled,
      (state, action: PayloadAction<Budget>) => {
        state.budgets.push(action.payload);
      }
    );
    builder.addCase(
      getAllBudgets.fulfilled,
      (state, action: PayloadAction<Budget[]>) => {
        state.budgets = action.payload;
      }
    );
    builder.addCase(
      updateBudget.fulfilled,
      (state, action: PayloadAction<Budget>) => {
        const index = state.budgets.findIndex(
          (budget) => budget.id === action.payload.id
        );
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      }
    );
    builder.addCase(
      deleteBudget.fulfilled,
      (state, action: PayloadAction<Budget>) => {
        const deletedBudgetId = action.payload.id;
        state.budgets = state.budgets.filter(
          (budget) => budget.id !== deletedBudgetId
        );
      }
    );
  },
});

const Base_URL = "http://localhost:5000";

export const addBudget = createAsyncThunk(
  "budget/addBudget",
  async (budget: Partial<Budget>) => {
    const response = await axios.post(`${Base_URL}/budgets`, budget);
    return response.data;
  }
);

export const getAllBudgets = createAsyncThunk(
  "budget/getAllBudgets",
  async (userId: string) => {
    const response = await axios.get(`${Base_URL}/budgets?userId=${userId}`);
    return response.data;
  }
);

export const updateBudget = createAsyncThunk(
  "budget/updateBudget",
  async (budget: Partial<Budget>) => {
    const response = await axios.put(
      `${Base_URL}/budgets/${budget.id}`,
      budget
    );
    return response.data;
  }
);

export const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async (id: string) => {
    const response = await axios.delete(`${Base_URL}/budgets/${id}`);
    return response.data;
  }
);

export default BudgetSlice.reducer;
