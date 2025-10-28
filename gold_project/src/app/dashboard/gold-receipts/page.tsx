import { prisma } from "@/lib/prisma"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GoldReceiptForm } from "@/components/gold-receipt-form"
import { Toaster } from "@/components/ui/sonner"

export default async function GoldReceiptsPage() {
  const receipts = await prisma.goldReceipt.findMany({
    include: {
      branch: true,
      receivedByUser: true,
    },
    orderBy: {
      receivedAt: "desc",
    },
  })

  const branches = await prisma.branch.findMany()
  const latestRate = await prisma.rateBoard.findFirst({
    orderBy: {
      effectiveDate: "desc",
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Gold Receipts</h1>

      <div className="my-8">
        <h2 className="text-xl font-semibold">New Receipt</h2>
        <GoldReceiptForm branches={branches} latestRate={latestRate} />
      </div>

      <Table>
        <TableCaption>A list of your recent gold receipts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Weight (g)</TableHead>
            <TableHead>Purity (%)</TableHead>
            <TableHead>Price/g</TableHead>
            <TableHead>Received By</TableHead>
            <TableHead>Received At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.branch.name}</TableCell>
              <TableCell>{r.weightGrams.toString()}</TableCell>
              <TableCell>{r.purityPercent.toString()}</TableCell>
              <TableCell>{r.pricePerGram.toString()}</TableCell>
              <TableCell>{r.receivedByUser.name}</TableCell>
              <TableCell>{r.receivedAt.toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  )
}
