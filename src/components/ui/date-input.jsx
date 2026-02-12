import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const DateInput = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <Input
            type="date"
            className={cn(
                "bg-background",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
DateInput.displayName = "DateInput"

export { DateInput }
