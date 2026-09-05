import { ComponentProps } from "react";

export function TabTrigger({ children, ...rest }: TabTriggerProps) {
    return (
        <button role="tab" {...rest}>{children}</button>
    )
}

interface TabTriggerProps extends ComponentProps<"button"> { }
