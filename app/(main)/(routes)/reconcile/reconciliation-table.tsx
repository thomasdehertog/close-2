"use client"

import { useState } from "react"
import { CheckCircle2, Square, PaperclipIcon, MessageSquare, ChevronDown, ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface AccountRow {
  id: string
  name: string
  attachments?: number
  comments?: number
  glBalance: number
  recBalance: number
  variance: number
  status?: "connected" | "pending" | "manual" | "none"
  children?: AccountRow[]
}

function AccountRowComponent({ 
  account, 
  level = 0,
  isExpanded,
  onToggle,
}: { 
  account: AccountRow
  level?: number
  isExpanded?: boolean
  onToggle?: () => void
}) {
  const hasChildren = account.children && account.children.length > 0
  const childCount = account.children?.length || 0

  const getStatusIcon = (status: AccountRow["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />
      case "manual":
        return <Square className="w-4 h-4 text-[#635BFF]/60" />
      case "none":
        return <Square className="w-4 h-4 text-gray-400" />
      default:
        return null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getVarianceColor = (variance: number) => {
    if (variance === 0) return "text-emerald-600"
    return "text-rose-600"
  }

  const getVarianceBadgeColor = (variance: number) => {
    if (variance === 0) return "bg-emerald-50 text-emerald-700"
    return "bg-rose-50 text-rose-700"
  }

  const getVariancePercentage = (variance: number, glBalance: number) => {
    if (variance === 0) return "0%"
    return `${Math.round((Math.abs(variance) / Math.abs(glBalance)) * 100)}%`
  }

  return (
    <TableRow 
      className={cn(
        "group hover:bg-[#F6F9FC]/50 transition-colors",
        hasChildren && "cursor-pointer",
        level === 0 && "bg-[#FDF7F3] border-y border-[#F6E7DE]"
      )}
      onClick={() => hasChildren && onToggle?.()}
    >
      <TableCell className="pl-4">
        <div className="flex items-center gap-4" style={{ paddingLeft: `${level * 16}px` }}>
          {hasChildren ? (
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
              <span className="text-[#0A2540] group-hover:text-[#635BFF] transition-colors">
                {account.name}
                {childCount > 0 && (
                  <span className="ml-1 text-muted-foreground">
                    ({childCount})
                  </span>
                )}
              </span>
            </div>
          ) : (
            <>
              <span className="text-[#0A2540] group-hover:text-[#635BFF] transition-colors">
                {account.name}
              </span>
              <div className="flex items-center gap-2 text-[#0A2540]/40">
                {account.attachments && (
                  <div className="flex items-center gap-1">
                    <PaperclipIcon className="w-3.5 h-3.5" />
                    <span className="text-xs">{account.attachments}</span>
                  </div>
                )}
                {account.comments && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-xs">{account.comments}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right font-mono text-[#0A2540]/80">{formatCurrency(account.glBalance)}</TableCell>
      <TableCell className="text-right font-mono text-[#0A2540]/80">
        <div className="flex items-center justify-end gap-2">
          {formatCurrency(account.recBalance)}
          {getStatusIcon(account.status)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <span className={`font-mono ${getVarianceColor(account.variance)}`}>
            {formatCurrency(Math.abs(account.variance))}
          </span>
          <Badge 
            variant="secondary" 
            className={cn(
              "min-w-[32px] justify-center",
              account.variance === 0 
                ? "bg-emerald-50 text-emerald-500 hover:bg-emerald-50" 
                : "bg-rose-50 text-rose-500 hover:bg-rose-50"
            )}
          >
            {getVariancePercentage(account.variance, account.glBalance)}
          </Badge>
        </div>
      </TableCell>
    </TableRow>
  )
}

interface ReconciliationTableProps {
  accounts: AccountRow[]
}

export default function ReconciliationTable({ accounts }: ReconciliationTableProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["assets"]));

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const renderAccountRows = (accounts: AccountRow[], level = 0) => {
    return accounts.flatMap(account => {
      const rows = [
        <AccountRowComponent 
          key={account.id} 
          account={account} 
          level={level}
          isExpanded={expandedSections.has(account.id)}
          onToggle={() => toggleSection(account.id)}
        />
      ];

      if (account.children && expandedSections.has(account.id)) {
        rows.push(...renderAccountRows(account.children, level + 1));
      }

      return rows;
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent bg-[#F6F9FC]">
          <TableHead className="pl-4 text-[#0A2540] font-medium text-sm">Account</TableHead>
          <TableHead className="text-right text-[#0A2540] font-medium text-sm">GL Balance</TableHead>
          <TableHead className="text-right text-[#0A2540] font-medium text-sm">Rec. Balance</TableHead>
          <TableHead className="text-right text-[#0A2540] font-medium text-sm">Variance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {renderAccountRows(accounts)}
      </TableBody>
    </Table>
  )
} 