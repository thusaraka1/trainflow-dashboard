import { TrainApproach } from '@/types/train';
import { Train, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainApproachCardProps {
  approach: TrainApproach;
}

const TrainApproachCard = ({ approach }: TrainApproachCardProps) => {
  const DirectionIcon = Train;

  const statusStyles = {
    approaching: 'bg-warning/10 text-warning border-warning/30',
    passed: 'bg-success/10 text-success border-success/30',
    stopped: 'bg-destructive/10 text-destructive border-destructive/30',
  };

  const getSpeedColor = (speed: number) => {
    if (speed === 0) return 'text-muted-foreground';
    if (speed < 60) return 'text-success';
    if (speed < 90) return 'text-warning';
    return 'text-destructive';
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="glass rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-primary/10">
              <Train className="w-5 h-5 text-primary" />
            </div>
            {approach.status === 'approaching' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full animate-pulse-glow" />
            )}
          </div>
          <div>
            <h4 className="font-semibold font-mono text-foreground">{approach.trainId}</h4>
            <p className="text-xs text-muted-foreground">{approach.stationName}</p>
          </div>
        </div>
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium rounded-md border capitalize',
            statusStyles[approach.status]
          )}
        >
          {approach.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Destination</p>
            <p className="text-sm font-medium capitalize">To {approach.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className={cn('w-4 h-4', getSpeedColor(approach.speed))} />
          <div>
            <p className="text-xs text-muted-foreground">Speed</p>
            <p className={cn('text-sm font-bold font-mono', getSpeedColor(approach.speed))}>
              {approach.speed} km/h
            </p>
          </div>
        </div>

        <div className="col-span-2 mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Distance</span>
            <span className="font-mono font-medium">{approach.distance.toFixed(1)} km</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${Math.max(0, Math.min(100, (1 - approach.distance / 20) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {approach.status === 'approaching' && approach.speed > 0 && (
        <div className="mt-4 pt-3 border-t border-border/30">
          <div className="relative h-1 bg-secondary rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-4 bg-primary rounded-full animate-train" />
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-3">{timeAgo(approach.timestamp)}</p>
    </div>
  );
};

export default TrainApproachCard;
