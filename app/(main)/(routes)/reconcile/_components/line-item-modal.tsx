"use client";

import * as React from "react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileSpreadsheet, Keyboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LineItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

const ACCOUNT_TYPES = ["Assets", "Liabilities"] as const;

const ACCOUNT_CATEGORIES = {
  Assets: [
    "Bank",
    "Debiteuren",
    "Voorraad",
    "Vaste Activa",
    "Immateriële Activa",
    "Beleggingen",
    "Vooruitbetaalde Kosten",
    "BTW Vordering",
    "Nog te Ontvangen",
    "Onderhanden Werk",
  ],
  Liabilities: [
    "Crediteuren",
    "Kortlopende Leningen",
    "Langlopende Leningen",
    "Belastingen",
    "BTW Afdracht",
    "Personeelskosten",
    "Voorzieningen",
    "Vooruitontvangen",
    "Obligaties",
    "Leaseverplichtingen",
  ],
} as const;

type AccountType = typeof ACCOUNT_TYPES[number];
type Category = typeof ACCOUNT_CATEGORIES[AccountType][number];

export function LineItemModal({ isOpen, onClose, workspaceId }: LineItemModalProps) {
  const { toast } = useToast();
  const createLineItem = useMutation(api.reconciliation.createLineItem);

  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [source, setSource] = useState<"excel" | "sheets" | "manual">("manual");
  const [accountType, setAccountType] = useState<AccountType>("Assets");
  const [category, setCategory] = useState("");
  const [glBalance, setGlBalance] = useState("");
  const [recBalance, setRecBalance] = useState("");

  const handleAccountTypeChange = React.useCallback((value: string) => {
    setAccountType(value as AccountType);
    setCategory(""); // Reset category when account type changes
  }, []);

  const handleCategoryChange = React.useCallback((value: string) => {
    setCategory(value);
  }, []);

  const handleSubmit = async () => {
    try {
      if (!category) {
        toast({
          title: "Missing category",
          description: "Please select a category for the line item.",
          variant: "destructive",
        });
        return;
      }

      await createLineItem({
        workspaceId,
        name,
        accountNumber,
        source,
        accountType,
        category,
        status: "active",
        varianceThreshold: 0,
        glBalance: parseFloat(glBalance) || 0,
        recBalance: parseFloat(recBalance) || 0,
        links: [],
        assignees: [],
      });

      toast({
        title: "Success",
        description: "Line item created successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create line item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Line Item</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter line item name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
            />
          </div>
          <div className="grid gap-2">
            <Label>Source</Label>
            <div className="flex gap-2">
              <Button
                variant={source === "excel" ? "default" : "outline"}
                size="sm"
                onClick={() => setSource("excel")}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </Button>
              <Button
                variant={source === "sheets" ? "default" : "outline"}
                size="sm"
                onClick={() => setSource("sheets")}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Google Sheets
              </Button>
              <Button
                variant={source === "manual" ? "default" : "outline"}
                size="sm"
                onClick={() => setSource("manual")}
                className="flex items-center gap-2"
              >
                <Keyboard className="w-4 h-4" />
                Manual
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Account Type</Label>
            <Select value={accountType} onValueChange={handleAccountTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="z-[9999]" position="popper">
                <SelectGroup>
                  <SelectLabel>Account Types</SelectLabel>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="z-[9999]" position="popper">
                <SelectGroup>
                  <SelectLabel>Categories for {accountType}</SelectLabel>
                  {ACCOUNT_CATEGORIES[accountType].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="glBalance">GL Balance</Label>
              <Input
                id="glBalance"
                type="number"
                value={glBalance}
                onChange={(e) => setGlBalance(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recBalance">Rec Balance</Label>
              <Input
                id="recBalance"
                type="number"
                value={recBalance}
                onChange={(e) => setRecBalance(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Line Item</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 