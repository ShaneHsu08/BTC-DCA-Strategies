import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant = 'default', size = 'default', disabled, ...props }, ref) => {
        const baseClasses = `
            inline-flex items-center justify-center gap-2
            rounded-xl font-semibold
            ring-offset-background
            transition-all duration-300 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:pointer-events-none disabled:opacity-50
            active:scale-[0.98]
            cursor-pointer
        `;

        const variantClasses = {
            default: `
                btn-web3 shimmer
                text-white
                hover:-translate-y-0.5
            `,
            outline: `
                border-2 border-primary/50
                bg-transparent
                text-primary
                hover:bg-primary/10
                hover:border-primary
            `,
            ghost: `
                bg-transparent
                text-foreground
                hover:bg-muted
            `
        };

        const sizeClasses = {
            default: 'h-11 px-5 py-2.5 text-sm',
            sm: 'h-9 px-3 py-2 text-xs',
            lg: 'h-14 px-8 py-4 text-base'
        };

        return (
            <button
                className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
                ref={ref}
                disabled={disabled}
                {...props}
            >
                {disabled ? (
                    <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {children}
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = 'Button';
