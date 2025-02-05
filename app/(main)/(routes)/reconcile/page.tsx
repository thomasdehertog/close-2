"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, MessageSquare, PaperclipIcon, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LineItemModal } from "./_components/line-item-modal";
import { cn } from "@/lib/utils";

// API response types
interface APILineItem {
  _id: string;
  name: string;
  accountNumber: string;
  glBalance: number;
  recBalance: number;
  source: "excel" | "sheets" | "manual";
  links: string[];
  reconciliation_line_item_id: string;
}

interface APICategory {
  id: string;
  name: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  children: APILineItem[];
}

interface APIAccountType {
  id: string;
  name: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  children: APICategory[];
}

// UI types
interface LineItem {
  id: string;
  name: string;
  accountNumber: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  status: "connected" | "pending" | "manual" | "none";
  recSource: "excel" | "sheets" | "manual";
  links: number;
  comments?: number;
  reconciliation_line_item_id: string;
}

interface Category {
  id: string;
  name: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  children: LineItem[];
}

interface AccountType {
  id: string;
  name: string;
  glBalance: number;
  recBalance: number;
  variance: number;
  children: Category[];
}

export default function ReconciliationPage() {
  const { user } = useUser();
  const userWorkspaces = useQuery(api.workspaces.get);
  const workspaceId = userWorkspaces?.[0]?._id || "";
  const [isLineItemModalOpen, setIsLineItemModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["Assets", "Cash and Cash Equivalents"]));
  
  const rawData = useQuery(api.reconciliation.getLineItems, { workspaceId });

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  if (!rawData) return <div>Loading...</div>;

  // Transform the API data into our interface structure
  const transformLineItem = (item: any): LineItem => ({
    id: item._id,
    name: item.name,
    accountNumber: item.accountNumber,
    glBalance: item.glBalance,
    recBalance: item.recBalance,
    variance: item.glBalance - item.recBalance,
    status: "connected",
    recSource: item.source,
    links: item.links.length,
    comments: 1, // Hardcoded for now
    reconciliation_line_item_id: item.reconciliation_line_item_id
  });

  const transformCategory = (category: any): Category => ({
    id: category.id,
    name: category.name,
    glBalance: category.glBalance,
    recBalance: category.recBalance,
    variance: category.variance,
    children: category.children.map(transformLineItem)
  });

  const transformAccountType = (accountType: any): AccountType => ({
    id: accountType.id,
    name: accountType.name,
    glBalance: accountType.glBalance,
    recBalance: accountType.recBalance,
    variance: accountType.variance,
    children: accountType.children.map(transformCategory)
  });

  const lineItems = rawData.map(transformAccountType);

  return (
    <div className="flex gap-6 p-4 max-w-[1400px] mx-auto">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span>Jul 2024</span>
            </div>
            <h1 className="text-xl font-semibold">Reconcile</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLineItemModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Line Item
            </Button>
            <h2 className="text-lg text-gray-600">1061 - Mercury Checking</h2>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[400px]">Account</TableHead>
                <TableHead className="text-right">GL Balance</TableHead>
                <TableHead className="text-right">Rec. Balance</TableHead>
                <TableHead className="text-right">Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((accountType) => (
                <AccountTypeRow
                  key={accountType.id}
                  accountType={accountType}
                  isExpanded={expandedSections.has(accountType.name)}
                  onToggle={() => toggleSection(accountType.name)}
                  expandedSections={expandedSections}
                  onToggleCategory={(categoryName) => toggleSection(categoryName)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="w-[300px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-green-50">
                Connected
              </Badge>
              Statement July 2022.xlsx
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid grid-cols-2 text-sm">
              <span className="text-gray-500">Status</span>
              <span>In Progress</span>
            </div>
            <div className="grid grid-cols-2 text-sm">
              <span className="text-gray-500">Category</span>
              <span>Banking</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Assignees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-02%20at%2012.07.35-lJ2qYexQwkdkOH91tApKdFixzpsIM8.png" />
                <AvatarFallback>EB</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">Erica Bernard</div>
                <div className="text-gray-500">Preparer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <LineItemModal
        isOpen={isLineItemModalOpen}
        onClose={() => setIsLineItemModalOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
}

function AccountTypeRow({
  accountType,
  isExpanded,
  onToggle,
  expandedSections,
  onToggleCategory,
}: {
  accountType: AccountType;
  isExpanded: boolean;
  onToggle: () => void;
  expandedSections: Set<string>;
  onToggleCategory: (categoryName: string) => void;
}) {
  return (
    <>
      <TableRow className="bg-gray-50 hover:bg-gray-50/80 cursor-pointer" onClick={onToggle}>
        <TableCell colSpan={4}>
          <div className="flex items-center gap-2 font-medium">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            {accountType.name}
            <span className="text-muted-foreground ml-2">
              ({accountType.children.length})
            </span>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && accountType.children.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          isExpanded={expandedSections.has(category.name)}
          onToggle={() => onToggleCategory(category.name)}
        />
      ))}
    </>
  );
}

function CategoryRow({
  category,
  isExpanded,
  onToggle,
}: {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <TableRow className="hover:bg-gray-50/50 cursor-pointer" onClick={onToggle}>
        <TableCell colSpan={4}>
          <div className="flex items-center gap-2 pl-8">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{category.name}</span>
            <span className="text-muted-foreground text-sm">
              ({category.children.length})
            </span>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && category.children.map((item) => (
        <LineItemRow key={item.id} item={item} />
      ))}
    </>
  );
}

function LineItemRow({ item }: { item: LineItem }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <TableRow className="hover:bg-gray-50/30">
      <TableCell>
        <div className="flex items-center gap-4 pl-16">
          <span className="text-sm">
            {item.accountNumber} - {item.name}
          </span>
          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex items-center gap-1">
              <PaperclipIcon className="w-3.5 h-3.5" />
              <span className="text-xs">{item.links}</span>
            </div>
            {item.comments && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-xs">{item.comments}</span>
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono">{formatCurrency(item.glBalance)}</TableCell>
      <TableCell className="text-right font-mono">{formatCurrency(item.recBalance)}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <span className={cn(
            "font-mono",
            item.variance === 0 ? "text-emerald-600" : "text-rose-600"
          )}>
            {formatCurrency(Math.abs(item.variance))}
          </span>
          <Badge
            variant="secondary"
            className={cn(
              "min-w-[32px] justify-center",
              item.variance === 0
                ? "bg-emerald-50 text-emerald-500"
                : "bg-rose-50 text-rose-500"
            )}
          >
            {item.variance === 0 ? "0%" : `${Math.round((Math.abs(item.variance) / Math.abs(item.glBalance)) * 100)}%`}
          </Badge>
        </div>
      </TableCell>
    </TableRow>
  );
} 