import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Role, CashDisbursementStatus } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CashDisbursementForm } from "@/components/cash-disbursement-form"
import { Toaster } from "@/components/ui/sonner"
import { ApproveButton } from "@/components/approve-button"
import { DisburseButton } from "@/components/disburse-button"

export default async function CashDisbursementsPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const disbursements = await prisma.cashDisbursement.findMany({
    include: {
      branch: true,
      issuedByUser: true,
      approvedByUser: true,
    },
    orderBy: {
      issuedAt: "desc",
    },
  })

  const branches = await prisma.branch.findMany()

  const canApproveOrDisburse = user?.role === Role.HEAD_OF_FINANCE

  return (
    <div>
      <h1 className="text-2xl font-bold">Cash Disbursements</h1>

      <div className="my-8">
        <h2 className="text-xl font-semibold">New Disbursement</h2>
        <CashDisbursementForm branches={branches} />
      </div>

      <Table>
        <TableCaption>A list of your recent cash disbursements.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Issued By</TableHead>
            <TableHead>Approved By</TableHead>
            <TableHead>Issued At</TableHead>
            {canApproveOrDisburse && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {disbursements.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.branch.name}</TableCell>
              <TableCell>{d.amount.toString()}</TableCell>
              <TableCell>{d.status}</TableCell>
              <TableCell>{d.issuedByUser.name}</TableCell>
              <TableCell>{d.approvedByUser?.name || "N/A"}</TableCell>
              <TableCell>{d.issuedAt.toDateString()}</TableCell>
              {canApproveOrDisburse && (
                <TableCell>
                  <div className="flex gap-2">
                    {d.status === CashDisbursementStatus.PENDING && (
                      <ApproveButton disbursementId={d.id} />
                    )}
                    {d.status === CashDisbursementStatus.APPROVED && (
                      <DisburseButton disbursementId={d.id} />
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  )
}
