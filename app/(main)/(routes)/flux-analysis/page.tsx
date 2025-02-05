"use client";

import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PricingModal } from "@/components/modals/pricing-modal";

const FluxAnalysisPage = () => {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
      <div className="h-full flex items-center justify-center bg-white">
        <div className="max-w-md text-center px-4">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-[#F08019]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#F08019]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">Flux Analysis</h1>
          
          <p className="text-muted-foreground mb-8">
            Analyze variations and trends in your financial data over time.
            Identify significant changes and get automated insights.
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

export default FluxAnalysisPage; 