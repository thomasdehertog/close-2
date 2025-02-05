"use client";

import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PricingModal } from "@/components/modals/pricing-modal";

const ReportsPage = () => {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
      <div className="h-full flex items-center justify-center bg-white">
        <div className="max-w-md text-center px-4">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-[#F08019]/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-[#F08019]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">Advanced Reports</h1>
          
          <p className="text-muted-foreground mb-8">
            Generate detailed financial reports and analytics dashboards.
            Get insights into your financial performance with customizable reports.
            This feature is only available on the Business plan.
          </p>

          <Button 
            className="bg-[#F08019] hover:bg-[#F08019]/90 text-white font-medium px-6"
            onClick={() => setShowPricing(true)}
          >
            Upgrade to Business
            <span className="ml-2">→</span>
          </Button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" 
             style={{ top: '60%' }} 
        />
      </div>

      <PricingModal 
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </>
  );
};

export default ReportsPage; 