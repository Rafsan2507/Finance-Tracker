"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { TiPlus } from "react-icons/ti";
import {
  addTransaction,
  Transaction,
} from "@/redux/TransactionSlice/TransactionSlice";
import { User } from "@/redux/AuthSlice/SignUp";
import { useRouter } from "next/navigation";

type Props = {
  allCategories: string[];
};

const AddTransaction = ({ allCategories }: Props) => {
  const [date, setDate] = React.useState<Date>();
  const dispatch = useDispatch<AppDispatch>();
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string | null>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number | string>(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getLoggedInUser = localStorage.getItem("user");
    if (getLoggedInUser) {
      const user: User = JSON.parse(getLoggedInUser);
      setCurrentUser(user);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) return router.push("/login");
    const transaction: Partial<Transaction> = {
      userId: currentUser.id,
      type: type,
      category: category || undefined,
      description: description,
      date: date,
      amount: amount as number,
    };
    dispatch(addTransaction(transaction));
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#eff0f2] text-[#1ba0e2] border-2 border-[#1ba0e2] hover:bg-[#1ba0e2] hover:text-white my-[2vh] text-md font-semibold gap-1">
          Add Transaction <TiPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50vw] h-[60vh]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Label htmlFor="type">Type</Label>
            <div className="grid grid-cols-4 items-center gap-4">
              <Select onValueChange={(value) => setType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Label htmlFor="category">Category</Label>
            <div>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allCategories.map((categoryItem) => (
                      <SelectItem value={categoryItem} key={categoryItem}>
                        {categoryItem}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="category"
                className="col-span-4"
                placeholder="Category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                className="col-span-4"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Amount"
                value={amount}
                className="col-span-4"
                onChange={(e) => {
                  const value = e.target.value;

                  setAmount(value === "" ? "" : parseInt(value));
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
