import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
    if (!name) return "";
    const nameArr = name.split(" ");

    if (nameArr.length === 1) return (name[0] + name[1]).toUpperCase();
    return (nameArr[0][0] + nameArr[1][0]).toUpperCase();
}

export function getFormattedDate(date: Date) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
    });
}
