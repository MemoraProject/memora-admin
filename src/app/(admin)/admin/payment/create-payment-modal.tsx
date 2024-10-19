import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react'
import CreatePayment from './create-payment'

interface CreatePaymentModalProps {
  onSuccess: () => void
}

export function CreatePaymentModal({ onSuccess }: CreatePaymentModalProps) {
  const [open, setOpen] = React.useState(false)
  

  const handleSuccess = () => {
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Payment
        </Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
          <DialogDescription>
            Create a new payment record here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreatePayment />
      </DialogContent>
    </Dialog>
  )
}