"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const ACCOUNTING_SYSTEMS = [
  { name: "QuickBooks", logo: "/logos/quickbooks.png" },
  { name: "Xero", logo: "/logos/xero.png" },
  { name: "Sage", logo: "/logos/sage.png" },
  { name: "NetSuite", logo: "/logos/netsuite.png" },
  { name: "Exact", logo: "/logos/exact.png" },
  { name: "SAP", logo: "/logos/sap.png" },
  { name: "Microsoft Dynamics", logo: "/logos/dynamics.png" },
  { name: "Twinfield", logo: "/logos/twinfield.png" },
];

export const ConnectGLPromo = () => {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold">
          Connect your General Ledger
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Import your financial data from 40+ accounting platforms.
        </p>
        
        <div className="mt-6 grid grid-cols-4 gap-4">
          {ACCOUNTING_SYSTEMS.map((system) => (
            <div 
              key={system.name}
              className="flex items-center justify-center p-2 rounded-md hover:bg-slate-100 transition"
            >
              <div className="relative h-8 w-8">
                <Image
                  src={system.logo}
                  alt={system.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        <Button 
          className="w-full mt-6 bg-[#F08019] hover:bg-[#F08019]/90 text-white"
          size="lg"
        >
          Connect GL →
        </Button>
      </div>
    </div>
  );
}; 