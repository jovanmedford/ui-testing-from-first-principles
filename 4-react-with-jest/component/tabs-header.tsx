import { ComponentProps } from "react";

export default function TabsHeader({ children, ...rest }: TabsHeaderProps) {
    return (
        <div role="tablist" {...rest}>
            {children}
        </div>
    )
}

interface TabsHeaderProps extends ComponentProps<"div"> { }
