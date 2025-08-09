import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Skeleton({ className, variant = 'default', size = 'md' }: SkeletonProps) {
  const baseClasses = "animate-pulse rounded-md bg-gray-200";
  
  const variantClasses = {
    default: "h-4 w-full",
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "h-4 w-full"
  };
  
  const sizeClasses = {
    sm: variant === 'circular' ? 'h-6 w-6' : 'h-3',
    md: variant === 'circular' ? 'h-8 w-8' : 'h-4',
    lg: variant === 'circular' ? 'h-12 w-12' : 'h-6',
    xl: variant === 'circular' ? 'h-16 w-16' : 'h-8'
  };

  return (
    <div 
      className={cn(
        baseClasses, 
        variantClasses[variant], 
        sizeClasses[size], 
        className
      )} 
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" size="md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        
        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="h-64 w-full">
          <div className="flex h-full items-end justify-between space-x-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1">
                <Skeleton 
                  className="w-full rounded-t" 
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonOverviewCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton variant="circular" size="md" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 