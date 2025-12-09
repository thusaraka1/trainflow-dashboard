import { Station } from '@/types/train';
import { MapPin, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: Station;
}

const StationCard = ({ station }: StationCardProps) => {
  const onlineSensors = station.sensors.filter(s => s.status === 'online').length;
  const offlineSensors = station.sensors.filter(s => s.status === 'offline').length;

  return (
    <div className="glass rounded-lg p-5 border border-border/50 hover:border-primary/30 transition-all duration-300 animate-slide-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{station.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{station.code}</p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-mono bg-secondary rounded-md text-muted-foreground">
          {station.totalApproaches} approaches
        </span>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-muted-foreground mb-2">Sensors</div>
        <div className="flex flex-wrap gap-2">
          {station.sensors.map((sensor) => (
            <div
              key={sensor.id}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
                sensor.status === 'online'
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              {sensor.status === 'online' ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              {sensor.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs text-muted-foreground">{onlineSensors} online</span>
          </div>
          {offlineSensors > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">{offlineSensors} offline</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationCard;
