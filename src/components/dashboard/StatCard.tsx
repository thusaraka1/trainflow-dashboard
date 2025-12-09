import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  subtitle?: string;
}

const StatCard = ({ title, value, icon, variant = 'default', subtitle }: StatCardProps) => {
  const variantStyles = {
    default: 'border-border/50',
    success: 'border-success/30 glow-success',
    warning: 'border-warning/30 glow-warning',
    destructive: 'border-destructive/30 glow-destructive',
  };

  const iconVariantStyles = {
    default: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    destructive: 'text-destructive bg-destructive/10',
  };

  return (
    <div
      className={cn(
        'glass rounded-lg p-6 border transition-all duration-300 hover:scale-[1.02]',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 font-mono">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconVariantStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
