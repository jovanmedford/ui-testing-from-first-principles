import { ComponentProps } from "react";


export function TabsPanel({ children, ...rest }: TabsPanelProps) {
    return (
        <div role="tabpanel" {...rest}>
            {children}
        </div>
    )
}

interface TabsPanelProps extends ComponentProps<"div"> { }
