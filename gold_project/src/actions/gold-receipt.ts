"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const formSchema = z.object({
  branchId: z.string(),
  weightGrams: z.coerce.number().positive(),
  purityPercent: z.coerce.number().min(0).max(100),
  pricePerGram: z.coerce.number().positive(),
  feesPercent: z.coerce.number().min(0).optional(),
  deductions: z.coerce.number().min(0).optional(),
  // ... other fields
})

export async function createGoldReceipt(
  values: z.infer<typeof formSchema>
) {
  const validatedFields = formSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // TODO: Get the current user's ID
  const receivedByUserId = "cuid_placeholder" // Replace with actual user ID

  try {
    await prisma.goldReceipt.create({
      data: {
        ...validatedFields.data,
        receivedByUserId,
        images: [], // TODO: Handle image uploads
      },
    })

    revalidatePath("/dashboard/gold-receipts")

    return {
      message: "Gold receipt created successfully.",
    }
  } catch (error) {
    return {
      message: "An error occurred while creating the gold receipt.",
    }
  }
}
