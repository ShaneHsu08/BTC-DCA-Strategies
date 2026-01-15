import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
    onTabChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = '', onTabChange }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        onTabChange?.(value);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`
                inline-flex items-center justify-start gap-1 p-1.5
                rounded-xl bg-secondary/40 border border-border/30
                overflow-x-auto scrollbar-hide
                ${className}
            `}
            role="tablist"
        >
            {children}
        </div>
    );
};

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '', icon }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(value)}
            className={`
                inline-flex items-center justify-center gap-2 px-4 py-2.5
                text-sm font-medium whitespace-nowrap
                rounded-lg transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                ${isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }
                ${className}
            `}
        >
            {icon && <span className={isActive ? 'opacity-100' : 'opacity-70'}>{icon}</span>}
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    const { activeTab } = context;

    if (activeTab !== value) return null;

    return (
        <div
            role="tabpanel"
            className={`mt-4 animate-fadeIn ${className}`}
        >
            {children}
        </div>
    );
};
