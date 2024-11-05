"use client";
import { format, getMonth } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { User } from "@/redux/AuthSlice/SignUp";
import {
  getAllTransactions,
  getTransactionByType,
} from "@/redux/TransactionSlice/TransactionSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Label,
  Pie,
  PieChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import { getAllBudgets } from "@/redux/BudgetSlice/BudgetSlice";

export const description = "A donut chart with text";

const getColor = (index: number) => {
  return `hsl(var(--chart-${index + 1}))`;
};

const chartConfig = {
  expenses: {
    label: "Expenses",
  },
} satisfies ChartConfig;

const chartConfig2 = {
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-expense-color))", 
  },
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-budget-color))",
  },
} satisfies ChartConfig;
type Props = {};

const Dashboard = (props: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "MMMM")
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    const getLoggedInUser = localStorage.getItem("user");
    if (getLoggedInUser) {
      const user: User = JSON.parse(getLoggedInUser);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getAllTransactions(currentUser.id));
      dispatch(getAllBudgets(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  const allTransactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );
  
  const allBudgets = useSelector((state: RootState) => state.budget.budgets);
  const filteredTransactions = allTransactions.filter(
    (transaction) =>
      transaction.date &&
      format(new Date(transaction.date), "MMMM") === selectedMonth
  );


  const expensesByCategory = filteredTransactions.reduce(
    (acc: { [key: string]: number }, transaction) => {
      const { category, amount } = transaction;
      if (
        category &&
        typeof category === "string" &&
        typeof amount === "number"
      ) {
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += amount;
      }
      return acc;
    },
    {}
  );

 
  const chartData = Object.entries(expensesByCategory).map(
    ([category, amount], index) => ({
      category,
      amount,
      fill: getColor(index),
    })
  );
  const totalIncome = allTransactions
        .filter(
          (transaction) =>
            transaction.date &&
            format(new Date(transaction.date), "MMMM") === selectedMonth &&
            transaction.type === "Income"
        )
        .reduce((acc, transaction) => acc + (transaction.amount ?? 0), 0);

  const filteredBudgets = allBudgets.filter(
    (budget) =>
      budget.date && format(new Date(budget.date), "MMMM") === selectedMonth
  );

 
  const monthlyData = months.map((month, index) => {
    const monthlyTransactions = allTransactions.filter(
      (transaction) =>
        transaction.date && getMonth(new Date(transaction.date)) === index && transaction.type === "Expense"
    );
    const monthlyBudgets = allBudgets.filter(
      (budget) => budget.date && getMonth(new Date(budget.date)) === index
    );

    const totalMonthlyExpenses = monthlyTransactions.reduce(
      (acc, transaction) => acc + (transaction.amount ?? 0),
      0
    );
    const totalMonthlyBudget = monthlyBudgets.reduce(
      (acc, budget) => acc + (budget.budget ?? 0),
      0
    );

    return {
      month,   
      budget: totalMonthlyBudget,
      expenses: totalMonthlyExpenses,
    };
  });


  const totalExpenses = filteredTransactions.reduce(
    (acc, transaction) => transaction.type === "Expense" ? acc + (transaction.amount ?? 0) : acc,
    0
  );

  const totalBudget = filteredBudgets.reduce(
    (acc, budget) => acc + (budget.budget ?? 0),
    0
  );

  
    
      
  
        
  

  const totalExpensesByCategory = React.useMemo(() => {
    return Object.values(expensesByCategory).reduce(
      (acc, curr) => acc + curr,
      0
    );
  }, [expensesByCategory]);
  return (
    <div className="bg-[#eff0f2] h-[100vh] overflow-auto">
      <div className=" flex justify-center py-8">
        <Select onValueChange={(value) => setSelectedMonth(value)}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {months.map((month) => (
                <SelectItem value={month} key={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 gap-4 px-8 mb-4">
        <div className="bg-white p-4 flex flex-col gap-2">
          <div className="text-md">
            Originally Budgeted
          </div>
          <div className="text-2xl text-[#12c48b]">
            {totalBudget} BDT
          </div>
        </div>
        <div className="bg-white p-4 flex flex-col gap-2">
          <div className="text-md">
            Spent so far
          </div>
          <div className="text-2xl text-[#ea5681]">
            {totalExpenses} BDT
          </div>
        </div>
        <div className="bg-white p-4 flex flex-col gap-2">
          <div className="text-md">
            Money left
          </div>
          <div className="text-2xl text-[#12c48b]">
            {totalBudget - totalExpenses} BDT
          </div>
        </div>
        <div className="bg-white p-4 flex flex-col gap-2">
          <div className="text-md">
            Money left
          </div>
          <div className="text-2xl text-[#12c48b]">
            {totalIncome} BDT
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 px-8">
      <div>
        <Card className="flex flex-col">
          <CardHeader >
            <CardTitle className="text-[#1ba0e2]">Expense Structure</CardTitle>
            <CardDescription>{selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                  paddingAngle={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalExpensesByCategory.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Expenses
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1ba0e2]">Monthly Budget vs Expenses</CardTitle>
            <CardDescription>Comparison for 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig2}
              className="mx-auto aspect-square max-h-[450px] max-w-full w-[600px]"
            >
              <BarChart accessibilityLayer data={monthlyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="expenses"
                  fill="hsl(var(--chart-expense-color))"
                  radius={4}
                />
                <Bar
                  dataKey="budget"
                  fill="hsl(var(--chart-budget-color))"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1ba0e2]">Total Budget & Expenses</CardTitle>
            <CardDescription>{selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 ">
            <div className="text-lg">Total Budget : {totalBudget} BDT</div>
            
            
            <div className="text-lg">Total Expense : {totalExpenses} BDT</div>
            <div className="text-lg">Remaining Balance : {totalBudget - totalExpenses} BDT</div>
            <div>{totalIncome}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
