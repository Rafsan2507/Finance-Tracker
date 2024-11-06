"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { User } from "@/redux/AuthSlice/SignUp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getTransactionByType } from "@/redux/TransactionSlice/TransactionSlice";
import { format, isValid } from "date-fns";
import { IoMdRemove } from "react-icons/io";
import AddBudget from "./AddBudget";
import UpdateBudget from "./UpdateBudget";
import { deleteBudget, getAllBudgets } from "@/redux/BudgetSlice/BudgetSlice";
type Props = {};

const BudgetTable = (props: Props) => {
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const [selectedMonth, setSelectedMonth] = useState<string[]>([
    format(new Date(), "MMMM"),
  ]);

  const [allCategories, setAllCategories] = useState<string[]>([
    "Food & Beverages",
    "Shopping",
    "House Rent",
    "Transportation",
    "Life & Entertainment",
    "Education",
    "Energy",
    "Health Care",
    "Electronics",
    "Accessories",
    "Technology",
  ]);

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem("user");
    if (getLoggedInUser) {
      const user: User = JSON.parse(getLoggedInUser);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getAllBudgets(currentUser.id));
      dispatch(
        getTransactionByType({
          userId: currentUser.id,
          type: "Expense",
        })
      );
    }
  }, [currentUser?.id, dispatch]);
  const budgets = useSelector((state: RootState) => state.budget.budgets);

  const transactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );

  useEffect(() => {
    const categories = Array.from(
      new Set(
        transactions.map((transaction) => transaction.category).filter(Boolean)
      )
    );
    setAllCategories((prevCategories) => [
      ...new Set([
        ...prevCategories,
        ...categories.filter(
          (category): category is string => category !== undefined
        ),
      ]),
    ]);
  }, [transactions]);

  const handleMonthSelection = (month: string) => {
    setSelectedMonth((prevSelectedMonths) =>
      prevSelectedMonths.includes(month)
        ? prevSelectedMonths.filter((m) => m !== month)
        : [...prevSelectedMonths, month]
    );
  };

  const handleCategorySelection = (category: string) => {
    setSelectedCategory((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const filteredBudgets = budgets.filter((budget) => {
    const budgetMonth = format(new Date(budget.date || new Date()), "MMMM");
    const matchMonth =
      selectedMonth.length === 0 || selectedMonth.includes(budgetMonth);
    const matchCategory =
      selectedCategory.length === 0 ||
      selectedCategory.includes(budget.category!);
    return matchMonth && matchCategory;
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date!);
    let transactionMonth = "";
    if (isValid(transactionDate)) {
      transactionMonth = format(transactionDate, "MMMM");
    }
    const matchMonth =
      selectedMonth.length === 0 || selectedMonth.includes(transactionMonth);
    const matchCategory =
      selectedCategory.length === 0 ||
      selectedCategory.includes(transaction.category!);
    return matchMonth && matchCategory;
  });

  const handleDeleteBudget = (id: string) => {
    dispatch(deleteBudget(id));
  };
  return (
    <div className=" bg-[#eff0f2] h-[100vh] overflow-auto">
      <div className="flex align-items-center">
        <div className="ml-16">
          <AddBudget />
        </div>
      </div>
      <div className="flex gap-8">
        <div className="bg-white flex flex-col gap-4 ml-16 p-4 w-[15vw]">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md">Month</AccordionTrigger>
              <AccordionContent>
                {months.map((month) => (
                  <div className="flex gap-2" key={month}>
                    <Checkbox
                      checked={selectedMonth.includes(month)}
                      onCheckedChange={() => handleMonthSelection(month)}
                    />
                    <div>{month}</div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-md">Category</AccordionTrigger>
              <AccordionContent>
                {allCategories.map((category) => (
                  <div className="flex gap-2" key={category}>
                    <Checkbox
                      checked={selectedCategory.includes(category)}
                      onCheckedChange={() => handleCategorySelection(category)}
                    />
                    <div>{category}</div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-white w-[75vw]">
          <Table>
            <TableCaption>A list of your recent Budgets.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Catergory</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Update</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => {
                const matchingTransactions = filteredTransactions.filter(
                  (transaction) => transaction.category === budget.category
                );

                return (
                  <TableRow key={budget.id}>
                    <TableCell>{budget.category}</TableCell>
                    <TableCell>{budget.budget}</TableCell>
                    <TableCell>
                      {budget.date
                        ? format(new Date(budget.date), "dd MMM yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {matchingTransactions.length > 0 ? (
                        matchingTransactions.map((transaction) => (
                          <div key={transaction.id}>{transaction.amount}</div>
                        ))
                      ) : (
                        <div>0</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <UpdateBudget budget={budget} />
                    </TableCell>
                    <TableCell>
                      <Button
                        className="bg-[#ea5681] hover:bg-[#ea5681] my-[2vh] text-lg font-bold"
                        onClick={() =>
                          budget.id !== undefined &&
                          handleDeleteBudget(budget.id)
                        }
                      >
                        <IoMdRemove />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BudgetTable;
