import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  if (!name) return "??";
  
  // Split by any whitespace or special characters
  const parts = name.split(/[\s-_]+/).filter(Boolean);
  
  if (parts.length === 0) return "??";
  
  if (parts.length === 1) {
    // For single word, take first two letters
    return parts[0].slice(0, 2).toUpperCase();
  }
  
  // Take first letter of first word and first letter of last word
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  { bg: "bg-rose-200", text: "text-rose-700" },      // Rose
  { bg: "bg-sky-200", text: "text-sky-700" },        // Sky Blue
  { bg: "bg-amber-200", text: "text-amber-700" },    // Amber
  { bg: "bg-emerald-200", text: "text-emerald-700" },// Emerald
  { bg: "bg-violet-200", text: "text-violet-700" },  // Violet
  { bg: "bg-orange-200", text: "text-orange-700" },  // Orange
  { bg: "bg-cyan-200", text: "text-cyan-700" },      // Cyan
  { bg: "bg-pink-200", text: "text-pink-700" },      // Pink
  { bg: "bg-lime-200", text: "text-lime-700" },      // Lime
  { bg: "bg-purple-200", text: "text-purple-700" },  // Purple
];

export function getNameColor(name: string) {
  if (!name) return AVATAR_COLORS[0];
  
  // Create a simple hash of the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Use the absolute value of the hash to pick a color
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
