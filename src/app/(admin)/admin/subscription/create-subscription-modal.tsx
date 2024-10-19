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
import { CreateSubscription } from './create-subscription'

interface CreateSubscriptionModalProps {
  onSuccess: () => void
}

export function CreateSubscriptionModal({ onSuccess }: CreateSubscriptionModalProps) {
  const [open, setOpen] = React.useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Subscription Plan</DialogTitle>
          <DialogDescription>
            Create a new subscription plan here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateSubscription onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}