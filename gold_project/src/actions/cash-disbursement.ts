"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { CashDisbursementStatus, Role } from "@prisma/client"

const formSchema = z.object({
  branchId: z.string(),
  amount: z.coerce.number().positive(),
  referenceNo: z.string().min(1),
  reason: z.string().optional(),
})

export async function createCashDisbursement(
  values: z.infer<typeof formSchema>
) {
  // ... (existing code)
}

export async function approveCashDisbursement(disbursementId: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== Role.HEAD_OF_FINANCE) {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.cashDisbursement.update({
      where: { id: disbursementId },
      data: {
        status: CashDisbursementStatus.APPROVED,
        approvedByUserId: session.user.id,
      },
    })
    // TODO: Create AuditLog entry
    revalidatePath("/dashboard/cash-disbursements")
    return { success: true }
  } catch (error) {
    return { error: "Failed to approve." }
  }
}

export async function disburseCashDisbursement(disbursementId: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== Role.HEAD_OF_FINANCE) {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.cashDisbursement.update({
      where: { id: disbursementId },
      data: { status: CashDisbursementStatus.DISBURSED },
    })
    // TODO: Create AuditLog entry
    revalidatePath("/dashboard/cash-disbursements")
    return { success: true }
  } catch (error) {
    return { error: "Failed to disburse." }
  }
}
