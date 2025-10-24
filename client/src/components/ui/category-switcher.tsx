import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CategorySwitcherProps {
  activeCategory: "female" | "male" | "trans";
  onCategoryChange: (category: "female" | "male" | "trans") => void;
  className?: string;
}

export function CategorySwitcher({ activeCategory, onCategoryChange, className = "" }: CategorySwitcherProps) {
  const categories = [
    {
      id: "female" as const,
      label: "Women",
      emoji: "💋",
      gradient: "from-pink-500 to-purple-600",
      activeColor: "bg-pink-600",
      count: "12,000+"
    },
    {
      id: "male" as const,
      label: "Men", 
      emoji: "🔥",
      gradient: "from-blue-600 to-indigo-700",
      activeColor: "bg-blue-600",
      count: "5,000+"
    },
    {
      id: "trans" as const,
      label: "Trans",
      emoji: "✨",
      gradient: "from-purple-500 to-pink-500", 
      activeColor: "bg-purple-600",
      count: "3,000+"
    }
  ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="lg"
          className={`relative overflow-hidden transition-all duration-300 ${
            activeCategory === category.id
              ? `${category.activeColor} text-white shadow-lg scale-105`
              : "hover:scale-102 border-2 hover:border-gray-300"
          }`}
        >
          {activeCategory === category.id && (
            <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-90`}></div>
          )}
          <div className="relative flex items-center gap-3">
            <span className="text-xl">{category.emoji}</span>
            <div className="flex flex-col items-start">
              <span className="font-semibold">{category.label}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  activeCategory === category.id 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100"
                }`}
              >
                {category.count} available
              </Badge>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}