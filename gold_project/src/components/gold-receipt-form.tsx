"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTransition, useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createGoldReceipt } from "@/actions/gold-receipt"
import type { Branch, RateBoard } from "@prisma/client"
import { AssayMethod } from "@prisma/client"

const formSchema = z.object({
  branchId: z.string().min(1),
  weightGrams: z.coerce.number().positive(),
  purityPercent: z.coerce.number().min(0).max(100),
  pricePerGram: z.coerce.number().positive(),
  assayMethod: z.nativeEnum(AssayMethod),
  feesPercent: z.coerce.number().min(0).optional(),
  deductions: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
})

interface GoldReceiptFormProps {
  branches: Branch[]
  latestRate: RateBoard | null
}

export function GoldReceiptForm({ branches, latestRate }: GoldReceiptFormProps) {
  const [isPending, startTransition] = useTransition()
  const [grossValue, setGrossValue] = useState(0)
  const [netValue, setNetValue] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchId: "",
      weightGrams: 0,
      purityPercent: 92.5,
      pricePerGram: latestRate?.pricePerGram.toNumber() || 0,
      assayMethod: AssayMethod.XRF,
      feesPercent: 0,
      deductions: 0,
      note: "",
    },
  })

  const watchedFields = form.watch()

  useEffect(() => {
    const { weightGrams, purityPercent, pricePerGram, feesPercent, deductions } = watchedFields
    const gross = (weightGrams * (purityPercent / 100)) * pricePerGram
    const net = gross - (deductions || 0) - (gross * (feesPercent || 0) / 100)
    setGrossValue(gross)
    setNetValue(net)
  }, [watchedFields])

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await createGoldReceipt(values)
      if (result.errors) {
        toast.error("Failed to create receipt.", {
          description: JSON.stringify(result.errors),
        })
      } else {
        toast.success("Gold receipt created successfully.")
        form.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields for all properties */}
        {/* ... */}
        <div>
          <p className="font-semibold">Gross Gold Value: {grossValue.toFixed(2)} GHS</p>
          <p className="font-semibold">Net Gold Value: {netValue.toFixed(2)} GHS</p>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Receipt"}
        </Button>
      </form>
    </Form>
  )
}
