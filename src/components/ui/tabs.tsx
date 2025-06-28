
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm p-2 text-muted-foreground shadow-lg border border-white/30 overflow-hidden",
      "flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-1",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "w-full sm:w-auto min-w-0 flex-shrink-0",
      "relative overflow-hidden",
      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cpscs-gold/20 data-[state=active]:via-yellow-100/30 data-[state=active]:to-cpscs-gold/20",
      "data-[state=active]:text-cpscs-blue data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-cpscs-gold/30",
      "data-[state=active]:transform data-[state=active]:scale-105",
      "hover:bg-gradient-to-r hover:from-cpscs-gold/10 hover:to-yellow-50/20 hover:text-cpscs-blue hover:scale-102",
      "text-gray-600 hover:shadow-md",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-cpscs-gold/5 before:to-yellow-100/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "animate-fade-in",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
