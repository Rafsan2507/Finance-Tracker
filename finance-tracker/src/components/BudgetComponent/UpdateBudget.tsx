import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { cn } from '@/lib/utils'
import { FaEdit } from 'react-icons/fa'
import { Budget, updateBudget } from '@/redux/BudgetSlice/BudgetSlice'

type Props = {
  budget: Partial<Budget>
}

const UpdateBudget = ({budget}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [date, setDate] = React.useState<Date>(budget.date || new Date());
  const [category, setCategory] = useState<string>(budget.category || "");
  const [amount, setAmount] = useState<number>(budget.budget || 0);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedBudget: Partial<Budget> = {
      id: budget.id,
      category: category,
      budget: amount,
      date: date
    };
    dispatch(updateBudget(updatedBudget));
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className="bg-[#13c892] hover:bg-[#1ba0e2] my-[2vh] text-lg"><FaEdit /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                className="col-span-4"
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount">Budget</Label>
              <Input
                id="amount"
                value={amount}
                className="col-span-4"
                onChange={(e) => setAmount(Number(e.target.value))}
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
                    onSelect={handleDateSelect}
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

export default UpdateBudget