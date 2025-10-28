import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BranchSwitcher } from "@/components/branch-switcher"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { branchId?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/signin")
  }

  const user = session.user
  const { branchId } = searchParams

  let whereClause: any = {}
  if (user.role === Role.BRANCH_MANAGER || user.role === Role.TELLER) {
    whereClause.branchId = user.branchId
  } else if (branchId) {
    whereClause.branchId = branchId
  }

  const totalCashDisbursed = await prisma.cashDisbursement.aggregate({
    _sum: { amount: true },
    where: whereClause,
  })

  const totalGoldGrams = await prisma.goldReceipt.aggregate({
    _sum: { weightGrams: true },
    where: whereClause,
  })

  // ... more KPI calculations ...

  const branches = await prisma.branch.findMany()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {(user.role === Role.ADMIN || user.role === Role.HEAD_OF_FINANCE) && (
          <BranchSwitcher branches={branches} />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Cash Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalCashDisbursed._sum.amount?.toFixed(2) ?? "0.00"} GHS
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Gold Received</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalGoldGrams._sum.weightGrams?.toFixed(2) ?? "0.00"} g
            </p>
          </CardContent>
        </Card>
        {/* ... more KPI cards ... */}
      </div>
    </div>
  )
}
