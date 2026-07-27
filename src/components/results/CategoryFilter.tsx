"use client";

import { getCategoryColor } from "@/lib/formatters";

interface CategoryFilterProps {
  categories: string[];
  selected: Set<string>;
  onToggle: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onToggle,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = selected.has(cat);
        const color = getCategoryColor(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            className="rounded-full px-3 py-1 text-xs font-medium border transition-colors"
            style={{
              backgroundColor: isActive ? color : "transparent",
              borderColor: color,
              color: isActive ? "#fff" : color,
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
