import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const presetColors = [
  0xff5733, // Red-Orange
  0x33b5e5, // Sky Blue
  0x2ecc71, // Green
  0x9b59b6, // Purple
  0xf1c40f, // Yellow
];


