import { Station } from '@/types/train';
import { MapPin, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: Station;
  colorIndex?: number;
}

const StationCard = ({ station, colorIndex = 1 }: StationCardProps) => {
  const onlineSensors = station.sensors.filter(s => s.status === 'online').length;
  const offlineSensors = station.sensors.filter(s => s.status === 'offline').length;
  const navigate = useNavigate();

  const colorVar = `var(--color-${colorIndex})`;

  return (
    <div
      id={`station-${station.id}`}
      onClick={() => navigate(`/station/${station.id}`)}
      className="glass rounded-lg p-5 border border-border/50 transition-all duration-300 animate-slide-in cursor-pointer hover:shadow-lg group relative overflow-hidden"
      style={{
        '--card-color': `hsl(${colorVar})`,
        background: `linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(${colorVar} / 0.1))`
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, transparent, hsl(${colorVar}))` }}
      />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: `hsl(${colorVar} / 0.1)` }}
          >
            <MapPin
              className="w-5 h-5"
              style={{ color: `hsl(${colorVar})` }}
            />
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
