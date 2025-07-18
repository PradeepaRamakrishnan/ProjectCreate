
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return "U";
  
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();
  
  return initials.slice(0, 2); // Limit to first two initials
}
