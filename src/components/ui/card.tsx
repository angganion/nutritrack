import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
  hover?: boolean;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className, variant = 'default', hover = false }: CardProps) {
  const baseClasses = "relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300";
  const variantClasses = {
    default: "border-gray-200",
    gradient: "border-transparent bg-gradient-to-br from-blue-50 to-indigo-50",
    glass: "border-gray-200/50 bg-white/80 backdrop-blur-sm"
  };
  const hoverClasses = hover ? "hover:shadow-lg hover:scale-[1.02] hover:border-gray-300" : "";

  return (
    <div className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-gray-600", className)}>
      {children}
    </p>
  );
} 