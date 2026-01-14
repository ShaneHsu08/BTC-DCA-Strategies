import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={`
                    flex h-10 w-full rounded-xl
                    border border-border/60
                    bg-background/80
                    px-3 py-2 text-sm
                    font-medium
                    ring-offset-background
                    file:border-0 file:bg-transparent file:text-sm file:font-medium
                    placeholder:text-muted-foreground/60
                    transition-colors duration-150 ease-out
                    hover:border-primary/40
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${className}
                `}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';
