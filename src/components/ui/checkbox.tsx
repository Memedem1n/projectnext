import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    className="peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-white/20 bg-white/5 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-brand-gold checked:border-brand-gold cursor-pointer transition-all"
                    ref={ref}
                    {...props}
                />
                <Check className="absolute left-0 top-0 h-4 w-4 hidden peer-checked:block text-black pointer-events-none p-0.5" strokeWidth={3} />
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
