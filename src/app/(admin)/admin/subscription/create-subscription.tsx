import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSubscriptionPlan } from '@/api/subscriptionPlan'
import { toast } from '@/hooks/use-toast'
import { SubcriptionPlanCreationPayload } from '@/models/subscriptionPlan'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  duration: z.number().min(1, {
    message: "Duration must be at least 1.",
  }),
  durationUnit: z.enum(['days', 'weeks', 'months', 'years']),
  benefit: z.string().optional(),
})

interface CreateSubscriptionProps {
  onSuccess: () => void
}

export function CreateSubscription({ onSuccess }: CreateSubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      duration: 1,
      durationUnit: "months",
      benefit: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await createSubscriptionPlan(values as SubcriptionPlanCreationPayload)
      toast({
        title: "Success",
        description: "Subscription plan created successfully.",
      })
      onSuccess()
      form.reset()
    } catch (error) {
      console.error("Failed to create subscription plan:", error)
      toast({
        title: "Error",
        description: "Failed to create subscription plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Premium Plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="99.99" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationUnit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="benefit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits</FormLabel>
              <FormControl>
                <Textarea placeholder="List the benefits of this plan..." {...field} />
              </FormControl>
              <FormDescription>
                Describe the benefits of this subscription plan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Subscription Plan"}
        </Button>
      </form>
    </Form>
  )
}