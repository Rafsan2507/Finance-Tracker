import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Transaction{
    id?: string;
    userId: string;
    type: string;
    category: string;
    description: string;
    date?: Date;
    amount:number;
}

export interface TransactionState{
    transactions: Partial<Transaction>[];
}

const initialState: TransactionState = {
    transactions: []
};

export const TransactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(
            addTransaction.fulfilled,
            (state, action: PayloadAction<Transaction>) => {
                state.transactions.push(action.payload);
            }
        );
        builder.addCase(
            getAllTransactions.fulfilled,
            (state, action: PayloadAction<Transaction[]>) => {
                state.transactions = action.payload;
            }
        );
        builder.addCase(
            getTransactionById.fulfilled,
            (state, action: PayloadAction<Transaction>) => {
                state.transactions.push(action.payload);
            }
        );
        builder.addCase(
            updateTransaction.fulfilled,
            (state, action: PayloadAction<Transaction>) => {
                const updatedTransaction = action.payload;
                const index = state.transactions.findIndex(
                    (transaction) => transaction.id === updatedTransaction.id
                );
                if (index !== -1) {
                    state.transactions[index] = updatedTransaction;
                }
            }
        )
        builder.addCase(
            deleteTransaction.fulfilled,
            (state, action: PayloadAction<Transaction>) => {
                const deletedTransactionId = action.payload.id;
                state.transactions = state.transactions.filter(
                    (transaction) => transaction.id !== deletedTransactionId
                );
            }
        )
        builder.addCase(
            getTransactionByType.fulfilled,
            (state, action: PayloadAction<Transaction[]>) => {
                state.transactions = action.payload;
            }
        )
    }
})

const Base_URL = "http://localhost:5000";

export const addTransaction = createAsyncThunk(
    "transaction/addTransaction",
    async (transaction: Partial<Transaction>) => {
        const response = await axios.post(
            `${Base_URL}/transactions`,
            transaction
        );
        return response.data;
    }
);

export const getAllTransactions = createAsyncThunk(
    "transaction/getAllTransactions",
    async (userId: string) => {
        const response = await axios.get(
            `${Base_URL}/transactions?userId=${userId}`
        );
        return response.data;
    }
);

export const getTransactionById = createAsyncThunk(
    "transaction/getTransactionById",
    async (transactionId: string) => {
        const response = await axios.get(
            `${Base_URL}/transactions/${transactionId}`
        );
        return response.data;
    }
);

export const updateTransaction = createAsyncThunk(
    "transaction/updateTransaction",
    async (transaction: Partial<Transaction>) => {
        const response = await axios.put(
            `${Base_URL}/transactions/${transaction.id}`,
            transaction
        );
        return response.data;
    }
);

export const deleteTransaction = createAsyncThunk(
    "transaction/deleteTransaction",
    async (transactionId: string) => {
        const response = await axios.delete(
            `${Base_URL}/transactions/${transactionId}`
        );
        return response.data;
    }
);

export const getTransactionByType = createAsyncThunk(
    "transaction/getTransactionByType",
    async ({userId,type}: {userId:string, type: string}) => {
        const response = await axios.get(
            `${Base_URL}/transactions?userId=${userId}&type=${type}`
        );
        return response.data;
    }
);

export default TransactionSlice.reducer;