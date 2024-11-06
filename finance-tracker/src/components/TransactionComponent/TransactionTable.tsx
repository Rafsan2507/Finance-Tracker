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
import AddTransaction from "./AddTransaction";
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
import {
  deleteTransaction,
  getAllTransactions,
} from "@/redux/TransactionSlice/TransactionSlice";
import { format, isValid } from "date-fns";
import { IoMdRemove } from "react-icons/io";
import UpdateTransaction from "./UpdateTransaction";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
type Props = {};

const TransactionTable = (props: Props) => {
  const currentMonth = format(new Date(), "MMMM");
  const [type, setType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string[]>([currentMonth]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();
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
    }
  }, [currentUser?.id, dispatch]);

  const allTransactions = useSelector(
    (state: RootState) => state.transaction.transactions
  );

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

  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchType = type === "all" || transaction.type === type;
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
    return matchType && matchMonth && matchCategory;
  });

  useEffect(() => {
    const categories = Array.from(
      new Set(
        allTransactions
          .map((transaction) => transaction.category)
          .filter(Boolean)
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
  }, [allTransactions]);

  const handleTypeChange = (type: string) => {
    setType(type);
  };

  return (
    <div className="bg-[#eff0f2] h-screen">
      <div className="flex align-items-center">
        <div className="ml-16">
          <AddTransaction allCategories={allCategories} />
        </div>
      </div>
      <div className="flex mb-4 ml-[20vw]">
        <div
          className={`bg-white ${
            type === "all" ? "bg-[#bbf2ff]" : "hover:bg-[#e4faff]"
          } w-[25vw] py-2 cursor-pointer border flex justify-center`}
          onClick={() => handleTypeChange("all")}
        >
          All
        </div>

        <div
          className={`bg-white ${
            type === "Expense" ? "bg-[#bbf2ff]" : "hover:bg-[#e4faff]"
          } w-[25vw] py-2 cursor-pointer border flex justify-center`}
          onClick={() => handleTypeChange("Expense")}
        >
          Expense
        </div>

        <div
          className={`bg-white ${
            type === "Income" ? "bg-[#bbf2ff]" : "hover:bg-[#e4faff]"
          } w-[25vw] py-2 cursor-pointer border flex justify-center`}
          onClick={() => handleTypeChange("Income")}
        >
          Income
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
            {/* <AccordionItem value="item-2">
              <AccordionTrigger className="text-md">Type</AccordionTrigger>
              <RadioGroup onValueChange={(value) => setType(value)}>
                <AccordionContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <RadioGroupItem value="all" id="all" />
                      <div>All</div>
                    </div>
                    <div className="flex gap-2">
                      <RadioGroupItem value="Income" id="Income" />
                      <div>Income</div>
                    </div>
                    <div className="flex gap-2">
                      <RadioGroupItem value="Expense" id="Expense" />
                      <div>Expense</div>
                    </div>
                  </div>
                </AccordionContent>
              </RadioGroup>
            </AccordionItem> */}
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
            <TableCaption>A list of your recent transactions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Update</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {transaction.date
                      ? format(new Date(transaction.date), "MM/dd/yyyy")
                      : ""}
                  </TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    <UpdateTransaction
                      transaction={transaction}
                      allCategories={allCategories}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        dispatch(deleteTransaction(transaction.id!))
                      }
                      className="bg-[#ea5681] hover:bg-[#ea5681] text-lg font-bold"
                    >
                      <IoMdRemove />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
