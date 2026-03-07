"use client";

import type { DateRange } from "react-day-picker";

import { Calendar } from "@workspace/ui/components/calendar";

type DatesPanelProps = {
    dateRange: DateRange | undefined;
    onSelect: (range: DateRange | undefined) => void;
};

export function DatesPanel({ dateRange, onSelect }: DatesPanelProps) {
    return (
        <div
            data-slot="search-bar-dates-panel"
            className="absolute z-50 top-full mt-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 bg-card rounded-2xl shadow-2xl ring-1 ring-border p-4 w-full"
        >
            <Calendar
                mode="range"
                selected={dateRange}
                onSelect={onSelect}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
                className="w-full bg-card"
            />
        </div>
    );
}
