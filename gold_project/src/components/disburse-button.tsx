"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { disburseCashDisbursement } from "@/actions/cash-disbursement"
import { toast } from "sonner"

interface DisburseButtonProps {
  disbursementId: string
}

export function DisburseButton({ disbursementId }: DisburseButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const result = await disburseCashDisbursement(disbursementId)
      if (result.error) {
        toast.error("Failed to disburse.", {
          description: result.error,
        })
      } else {
        toast.success("Disbursement marked as disbursed.")
      }
    })
  }

  return (
    <Button onClick={handleClick} disabled={isPending} variant="secondary">
      {isPending ? "Disbursing..." : "Disburse"}
    </Button>
  )
}
