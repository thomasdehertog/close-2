"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectBankModal = ({
  isOpen,
  onClose,
}: ConnectBankModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Don&apos;t forget to add your bank accounts</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-auto p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Here&apos;s why this step is important:
          </p>

          <div className="space-y-4">
            {/* Real-time Bank Data */}
            <div className="flex gap-x-3">
              <div className="bg-blue-100 p-2 rounded-md h-fit">
                <svg className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Real-time bank data</p>
                <p className="text-sm text-muted-foreground">
                  Get instant access to your latest bank transactions and balances.
                </p>
              </div>
            </div>

            {/* Automated Bank Reconciliation */}
            <div className="flex gap-x-3">
              <div className="bg-blue-100 p-2 rounded-md h-fit">
                <svg className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Automated bank reconciliation</p>
                <p className="text-sm text-muted-foreground">
                  Save hours with automated matching of bank transactions to your GL.
                </p>
              </div>
            </div>

            {/* Cash Flow Monitoring */}
            <div className="flex gap-x-3">
              <div className="bg-blue-100 p-2 rounded-md h-fit">
                <svg className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 20V4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 20v-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Enhanced cash flow monitoring</p>
                <p className="text-sm text-muted-foreground">
                  Track your cash position and forecast future cash flows accurately.
                </p>
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-6"
            size="lg"
            onClick={onClose}
          >
            Continue to connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 