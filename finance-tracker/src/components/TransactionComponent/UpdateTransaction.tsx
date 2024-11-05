import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
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
import { useRouter } from 'next/navigation'
import { Transaction, updateTransaction } from '@/redux/TransactionSlice/TransactionSlice'

type Props = {
    transaction: Partial<Transaction>;
    allCategories: string[];
}

const UpdateTransaction = ({transaction, allCategories}: Props) => {
    const [date, setDate] = React.useState<Date>(transaction.date || new Date());
  const dispatch = useDispatch<AppDispatch>();
  const [type, setType] = useState<string>(transaction.type || "");
  const [category, setCategory] = useState<string>(transaction.category || "");
  const [description, setDescription] = useState<string>(transaction.description || "");
  const [amount, setAmount] = useState<number>(transaction.amount || 0);
  const router = useRouter();
 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedTransaction: Partial<Transaction> = {
      id: transaction.id,
      type: type,
      category: category,
      description: description,
      date: date,
      amount: amount,
    };
    dispatch(updateTransaction(updatedTransaction));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
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
            <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                name='type'
                value={type}
                className="col-span-4"
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={transaction.category || "Select Category"} />
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
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
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={amount}
                className="col-span-4"
                onChange={(e) => setAmount(Number(e.target.value))}
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
  )
}

export default UpdateTransaction