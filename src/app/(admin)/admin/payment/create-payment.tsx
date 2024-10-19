import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PaymentCreationPayload } from '@/models/payment'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  amount: z.number().min(0, { message: "Amount must be a positive number" }),
  paymentDate: z.string().min(1, { message: "Payment date is required" }),
  dateCreated: z.string().min(1, { message: "Date created is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  description: z.string().nullable(),
  userSubscription: z.string().nullable(),
})

type FormValues = z.infer<typeof formSchema>

const createPayment = async (payload: PaymentCreationPayload) => {
  // Implement your API call here
  console.log('Creating payment:', payload)
  // For example: return await fetch('/api/payments', { method: 'POST', body: JSON.stringify(payload) })
}

export default function CreatePayment() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      paymentDate: '',
      dateCreated: new Date().toISOString().split('T')[0], // Current date
      status: '',
      description: null,
      userSubscription: null,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      await createPayment(values as PaymentCreationPayload)
      toast({
        title: "Success",
        description: "Payment created successfully",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment",
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userSubscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Subscription (Optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Payment'}
        </Button>
      </form>
    </Form>
  )
}