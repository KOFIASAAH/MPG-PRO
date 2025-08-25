"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { approveCashDisbursement } from "@/actions/cash-disbursement"
import { toast } from "sonner"

interface ApproveButtonProps {
  disbursementId: string
}

export function ApproveButton({ disbursementId }: ApproveButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const result = await approveCashDisbursement(disbursementId)
      if (result.error) {
        toast.error("Failed to approve disbursement.", {
          description: result.error,
        })
      } else {
        toast.success("Disbursement approved successfully.")
      }
    })
  }

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? "Approving..." : "Approve"}
    </Button>
  )
}
