"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConnectGLModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectGLModal = ({
  isOpen,
  onClose,
}: ConnectGLModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Don&apos;t forget to add your general ledger</span>
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
            {/* Automated Reconciliation */}
            <div className="flex gap-x-3">
              <div className="bg-blue-100 p-2 rounded-md h-fit">
                <svg className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Ensure automated reconciliation</p>
                <p className="text-sm text-muted-foreground">
                  Match transactions automatically between your GL and bank statements.
                </p>
              </div>
            </div>

            {/* Real-time Analysis */}
            <div className="flex gap-x-3">
              <div className="bg-blue-100 p-2 rounded-md h-fit">
                <svg className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 12l3-3 3 3 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Real-time flux analysis</p>
                <p className="text-sm text-muted-foreground">
                  Get instant insights into account fluctuations and trends.
                </p>
              </div>
            </div>

            {/* Month-end Closing */}
            <div className="flex gap-x-3">
              <div className="bg-blue-100 p-2 rounded-md h-fit">
                <svg className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Streamline month-end closing</p>
                <p className="text-sm text-muted-foreground">
                  Reduce closing time with automated checks and balances.
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