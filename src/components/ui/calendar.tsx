"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/libs/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 w-full", className)}
      components={{
        Nav: ({ onPreviousClick, onNextClick }) => (
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={onPreviousClick}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={onNextClick}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        ),
      }}
      classNames={{
        months: "w-full",
        month: "w-full",
        caption: "flex justify-center mb-4",
        caption_label: "text-lg font-semibold",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-center text-sm text-gray-500 w-9 font-normal",
        row: "flex",
        cell: "text-center w-9 h-9",
        day: cn(
          "w-9 h-9 text-center hover:bg-gray-100 rounded",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        ),
        day_outside: "text-gray-300",
        day_today: "bg-blue-100 text-blue-600 font-bold",
        day_selected: "bg-blue-500 text-white rounded-full",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
