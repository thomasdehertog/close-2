"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({
  isOpen,
  onClose
}: PricingModalProps) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual financial professionals",
      price: isAnnual ? 79 : 99,
      features: [
        "Basic financial reporting",
        "Up to 3 team members",
        "Monthly reconciliation",
        "Basic AI assistance",
        "Email support",
        "Standard analytics",
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "outline" as const,
    },
    {
      name: "Growth",
      description: "Ideal for growing finance teams",
      price: isAnnual ? 149 : 179,
      features: [
        "Everything in Starter, plus:",
        "Up to 10 team members",
        "Advanced reconciliation",
        "Enhanced AI insights",
        "Priority support",
        "Custom reporting",
        "Team collaboration tools",
      ],
      popular: true,
      buttonText: "Upgrade Now",
      buttonVariant: "default" as const,
    },
    {
      name: "Business",
      description: "For large organizations",
      price: "Custom",
      features: [
        "Everything in Growth, plus:",
        "Unlimited team members",
        "Enterprise reconciliation",
        "Advanced AI automation",
        "24/7 priority support",
        "Custom integrations",
        "Advanced security features",
        "Dedicated account manager",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-6 overflow-y-auto max-h-[95vh]">
        <div className="px-4 mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={cn(
              "text-sm",
              !isAnnual && "text-muted-foreground"
            )}>Monthly Billing</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={cn(
              "text-sm",
              isAnnual && "text-muted-foreground"
            )}>
              Annual Billing
              <span className="ml-2 text-xs text-[#F08019]">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl bg-white p-6 shadow-lg",
                plan.popular && "border-2 border-[#F08019]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-[#F08019] px-3 py-1 text-center text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="mb-4">
                {typeof plan.price === 'number' ? (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">/ month</span>
                    {isAnnual && (
                      <span className="text-xs text-muted-foreground ml-2">(billed annually)</span>
                    )}
                  </div>
                ) : (
                  <div className="text-3xl font-bold">{plan.price}</div>
                )}
              </div>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#F08019]" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  plan.buttonVariant === "default" && "bg-[#F08019] hover:bg-[#F08019]/90"
                )}
                variant={plan.buttonVariant}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Trusted by thousands of financial professionals. 
            Not sure what plan is right for you?{" "}
            <button className="text-[#F08019] hover:underline" onClick={() => {}}>
              Contact Sales
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 