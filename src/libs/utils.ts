import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import { env } from "@/env.mjs";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function randomizeBadgeColor() {
    const backgroundColorClasses = [
        'bg-blue-100 text-blue-800',
        'bg-gray-100 text-gray-800',
        'bg-red-100 text-red-800',
        'bg-green-100 text-green-800',
        'bg-yellow-100 text-yellow-800',
        'bg-indigo-100 text-indigo-800',
        'bg-purple-100 text-purple-800',
        'bg-pink-100 text-pink-800',
    ];

    const randomIndex = Math.floor(Math.random() * backgroundColorClasses.length);

   return backgroundColorClasses[randomIndex];
}

export function absoluteUrl(path: string) {
    return `${env.NEXT_PUBLIC_APP_URL}/${path}`
}