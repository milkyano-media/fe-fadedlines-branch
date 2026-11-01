"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  disabledDates?: Date[];
};
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  disabledDates = [],
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return true;
    }

    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(today.getDate() + 60);
    if (date > sixtyDaysFromNow) {
      return true;
    }

    return disabledDates.some(disabledDate =>
      date.getFullYear() === disabledDate.getFullYear() &&
      date.getMonth() === disabledDate.getMonth() &&
      date.getDate() === disabledDate.getDate()
    );
  };

  return (
    <div>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col w-full",
          month: "space-y-4 w-full",
          caption: "flex justify-between pt-1 pb-2 relative items-center mb-4 border-b border-white/60",
          caption_label: "font-display text-lg uppercase tracking-wide text-[#F0F0F0]",
          nav: "space-x-2 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-[#2B2B2B] border border-white/60 text-[#F0F0F0] p-0 rounded-md hover:bg-[#4A4A4A] hover:text-white disabled:opacity-30 disabled:pointer-events-none",
          ),
          nav_button_previous: "",
          nav_button_next: "",
          table: "w-full border-collapse",
          head_row: "flex w-full gap-1.5",
          head_cell:
            "flex-1 text-center text-[#F0F0F0]/80 font-body font-normal text-sm",
          row: "flex w-full mt-1.5 gap-1.5",
          cell: "flex-1 h-11 md:h-12 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: cn(
            "inline-flex items-center justify-center h-full w-full p-0 rounded-lg font-body text-base transition-colors",
            "bg-[#2B2B2B] text-[#F0F0F0] border border-white/10 hover:bg-[#4A4A4A]",
          ),
          day_range_end: "day-range-end",
          day_selected:
            "!bg-[#2B2B2B] !text-white !border-2 !border-white hover:!bg-[#2B2B2B]",
          day_today: "!bg-[#E3E0DA] !text-[#2B2B2B] font-semibold hover:!bg-[#E3E0DA]",
          day_outside:
            "day-outside !bg-[#4A4A4A] !text-[#9A9A96] !border-transparent opacity-60",
          day_disabled: "!bg-[#4A4A4A] !text-[#9A9A96] !border-transparent opacity-60 cursor-not-allowed hover:!bg-[#4A4A4A]",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        month={currentMonth}
        onMonthChange={handleMonthChange}
        disabled={isDateDisabled}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }