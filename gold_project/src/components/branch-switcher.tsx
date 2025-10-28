"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Branch } from "@prisma/client"

interface BranchSwitcherProps {
  branches: Branch[]
}

export function BranchSwitcher({ branches }: BranchSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentBranchId = searchParams.get("branchId")

  const handleBranchChange = (branchId: string) => {
    const params = new URLSearchParams(searchParams)
    if (branchId === "all") {
      params.delete("branchId")
    } else {
      params.set("branchId", branchId)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select onValueChange={handleBranchChange} defaultValue={currentBranchId || "all"}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a branch" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Branches</SelectItem>
        {branches.map((branch) => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
