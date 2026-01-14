import React from 'react';

const TooltipContext = React.createContext<{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    anchorEl: HTMLElement | null;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}>({
    open: false,
    setOpen: () => {},
    anchorEl: null,
    setAnchorEl: () => {},
});

const useTooltip = () => React.useContext(TooltipContext);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};

export const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    return (
        <TooltipContext.Provider value={{ open, setOpen, anchorEl, setAnchorEl }}>
            <div className="relative inline-flex">{children}</div>
        </TooltipContext.Provider>
    );
};

export const TooltipTrigger: React.FC<{ children: React.ReactElement; asChild?: boolean }> = ({ children, asChild = false }) => {
    const { setOpen, setAnchorEl } = useTooltip();
    const triggerRef = React.useRef<HTMLElement>(null);

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };
    
    const child = React.Children.only(children);

    if (asChild) {
        // FIX: Add a generic type to `React.isValidElement` to inform TypeScript about the shape of
        // `child.props`. This resolves type errors when spreading props and accessing event handlers,
        // while correctly composing them to preserve both Tooltip and child functionality.
        if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(child)) {
            return <>{child}</>;
        }
        return React.cloneElement(child, {
            ...child.props,
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                handleMouseEnter(e);
                child.props.onMouseEnter?.(e);
            },
            onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                handleMouseLeave();
                child.props.onMouseLeave?.(e);
            },
        });
    }

    return (
        <span
            ref={triggerRef as React.RefObject<HTMLSpanElement>}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </span>
    );
};


export const TooltipContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    const { open, anchorEl } = useTooltip();
    
    if (!open || !anchorEl) return null;
    
    return (
        <div
            className={`absolute z-60 w-max max-w-xs p-2 rounded-md bg-popover text-popover-foreground text-sm shadow-md bottom-full mb-2 ${className}`}
            style={{
                left: '50%',
                transform: 'translateX(-50%)',
            }}
        >
            {children}
        </div>
    );
};
