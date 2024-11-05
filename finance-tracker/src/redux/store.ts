import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./AuthSlice/SignUp";
import { TransactionSlice } from "./TransactionSlice/TransactionSlice";
import { BudgetSlice } from "./BudgetSlice/BudgetSlice";


export const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    transaction: TransactionSlice.reducer,
    budget: BudgetSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;