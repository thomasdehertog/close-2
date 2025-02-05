"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MonthSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export function MonthSelectorModal({
  isOpen,
  onClose,
  triggerRef
}: MonthSelectorModalProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedYear, setSelectedYear] = useState("2024");

  const months = [
    { name: "January", completion: 100 },
    { name: "February", completion: 100 },
    { name: "March", completion: 100, isQuarterEnd: true },
    { name: "April", completion: 100 },
    { name: "May", completion: 100 },
    { name: "June", completion: 100, isQuarterEnd: true },
    { name: "July", completion: 100 },
    { name: "August", completion: 100 },
    { name: "September", completion: 100, isQuarterEnd: true },
    { name: "October", completion: 0 },
    { name: "November", completion: 0, isCurrent: true },
    { name: "December", completion: 0, isQuarterEnd: true }
  ];

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left
      });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        const modalElement = document.getElementById("month-selector-modal");
        if (modalElement && !modalElement.contains(event.target as Node)) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="month-selector-modal"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            zIndex: 50,
          }}
          className="bg-white rounded-lg shadow-lg border w-[400px] max-h-[600px] overflow-hidden flex flex-col"
        >
          <Tabs defaultValue={selectedYear} className="w-full" onValueChange={setSelectedYear}>
            <div className="px-1 pt-1 bg-white">
              <TabsList className="w-full">
                <TabsTrigger value="2024" className="flex-1">2024</TabsTrigger>
                <TabsTrigger value="2023" className="flex-1">2023</TabsTrigger>
                <TabsTrigger value="2022" className="flex-1">2022</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={selectedYear} className="mt-0">
              <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
                {months.map((month) => (
                  <div
                    key={month.name}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer",
                      month.isCurrent && "bg-muted/50"
                    )}
                    onClick={() => {
                      // Handle month selection
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {month.name}
                      </span>
                      {month.isQuarterEnd && (
                        <Badge variant="secondary" className="text-xs bg-muted">
                          Quarter-End
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={month.completion === 100 ? "outline" : "secondary"}
                        className={cn(
                          "text-xs",
                          month.completion === 100 ? "bg-green-50 text-green-700 border-green-200" : "bg-muted"
                        )}
                      >
                        {month.completion}%
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          month.completion === 100 ? "bg-green-50 text-green-700 border-green-200" : "bg-muted"
                        )}
                      >
                        {month.completion === 100 ? "Closed" : "Open"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 