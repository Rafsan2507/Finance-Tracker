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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { TiPlus } from "react-icons/ti";
import { User } from "@/redux/AuthSlice/SignUp";
import { useRouter } from "next/navigation";
import { addBudget, Budget } from "@/redux/BudgetSlice/BudgetSlice";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { getAllTransactions } from "@/redux/TransactionSlice/TransactionSlice";
type Props = {}

const AddBudget = (props: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [date, setDate] = React.useState<Date>();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [category, setCategory] = useState<string>("");
  const [budget, setBudget] = useState<number>(0);
    const router = useRouter();
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
          dispatch(getAllTransactions(currentUser.id));
        }
      }, [currentUser?.id, dispatch]);
    
      const allTransactions = useSelector(
        (state: RootState) => state.transaction.transactions
      );

      useEffect(() => {
        const categories = Array.from(
          new Set(
            allTransactions
              .map((transaction) => transaction.category)
              .filter(Boolean)
          )
        );
        setAllCategories((prevCategories) => [
          ...new Set([...prevCategories, ...categories.filter((category): category is string => category !== undefined)]),
        ]);
      }, [allTransactions]);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!currentUser) return router.push("/login")
        const budgets: Partial<Budget> = {
          userId: currentUser.id,
          category: category,
          budget: budget,
          date: date
        };
        dispatch(addBudget(budgets));
      };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#eff0f2] text-[#1ba0e2] border-2 border-[#1ba0e2] hover:bg-[#1ba0e2] hover:text-white my-[2vh] text-md font-bold gap-1">
          Add Budget <TiPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="amount">Budget</Label>
              <Input
                id="amount"
                className="col-span-4"
                onChange={(e)=>setBudget(Number(e.target.value))}
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
          </div>
          <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddBudget