import { ComponentProps } from "react"

export function Tabs({ children, className, ...rest }: TabsProps) {
    return (
        <div {...rest} className={className ? `tabs ${className}` : "tabs"}>
            {children}
        </div>
    )
}

interface TabsProps extends ComponentProps<"div"> { }
