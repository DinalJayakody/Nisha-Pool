"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/providers/state-provider";
import { CreditCard, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const transactionTypes = [
  { value: "table_session", label: "Table Session" },
  { value: "food", label: "Food" },
  { value: "beverage", label: "Beverage" },
  { value: "merchandise", label: "Merchandise" },
  { value: "other", label: "Other Income" },
  { value: "expense", label: "Expense" },
];

const formSchema = z.object({
  type: z.string(),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  tableId: z.string().optional(),
});

export function TransactionForm() {
  const { addTransaction, tables, refreshData } = useAppState();
  const { toast } = useToast();
  const [isExpense, setIsExpense] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "other",
      amount: 0,
      description: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // If it's an expense, make amount negative
    const amount = isExpense ? -Math.abs(values.amount) : Math.abs(values.amount);
    
    addTransaction(
      values.type,
      amount,
      values.description,
      values.tableId
    );
    
    toast({
      title: "Transaction added",
      description: `${isExpense ? "Expense" : "Income"} of $${Math.abs(amount).toFixed(2)} was recorded.`,
    });
    
    form.reset({
      type: "other",
      amount: 0,
      description: "",
    });
  }
  
  // Update isExpense when type changes
  const watchType = form.watch("type");
  if (watchType === "expense" && !isExpense) {
    setIsExpense(true);
  } else if (watchType !== "expense" && isExpense) {
    setIsExpense(false);
  }
  
  // Filter tables to only show available tables if table_session is selected
  const availableTables = tables.filter(table => table.status === "available");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-500" />
          Add Transaction
        </CardTitle>
        <CardDescription>
          Record a new transaction to the cash register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset tableId if changing from table_session
                      if (field.value === "table_session" && value !== "table_session") {
                        form.setValue("tableId", undefined);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("type") === "table_session" && (
              <FormField
                control={form.control}
                name="tableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Table</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a table" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTables.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No available tables
                          </SelectItem>
                        ) : (
                          availableTables.map((table) => (
                            <SelectItem key={table.id} value={table.id}>
                              {table.name} ({table.size})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Only available tables can be selected for a new session
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isExpense ? "Expense Amount" : "Amount"}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        className="pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the {isExpense ? "expense" : "transaction"} amount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter transaction details"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the transaction
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              <Check className="mr-2 h-4 w-4" />
              Submit Transaction
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}