import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Train } from 'lucide-react';
import Header from '@/components/dashboard/Header';

import StationCard from '@/components/dashboard/StationCard';
import TrainApproachCard from '@/components/dashboard/TrainApproachCard';
import { mockStations, mockTrainApproaches } from '@/data/mockData';
import { TrainApproach } from '@/types/train';

const Index = () => {
  const navigate = useNavigate();
  const [approaches, setApproaches] = useState(mockTrainApproaches);


  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setApproaches((prev) =>
        prev.map((approach) => {
          if (approach.status === 'approaching' && approach.speed > 0) {
            const speedChange = Math.floor(Math.random() * 10) - 5;
            const newSpeed = Math.max(0, Math.min(120, approach.speed + speedChange));
            return { ...approach, speed: newSpeed };
          }
          return approach;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const activeApproaches = approaches.filter((a) => a.status === 'approaching');

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}


        <div className="w-full">
          {/* Train Lines Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Train Lines</h2>
              <span className="text-xs text-muted-foreground font-mono">
                {Array.from(new Set(mockStations.map(s => s.line))).filter(Boolean).length} lines
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Set(mockStations.map(s => s.line))).filter(Boolean).map((line, index) => {
                const stationCount = mockStations.filter(s => s.line === line).length;
                const colorIndex = (index % 5) + 1;
                const colorVar = `var(--color-${colorIndex})`;

                return (
                  <div
                    key={line}
                    onClick={() => navigate(`/line/${encodeURIComponent(line as string)}`)}
                    className="glass rounded-xl p-6 border border-border/50 transition-all duration-300 cursor-pointer hover:shadow-lg group relative overflow-hidden"
                    style={{
                      '--card-color': `hsl(${colorVar})`,
                      background: `linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(${colorVar} / 0.1))`
                    } as React.CSSProperties}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, transparent, hsl(${colorVar}))` }}
                    />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div
                        className="p-3 rounded-lg transition-colors"
                        style={{ backgroundColor: `hsl(${colorVar} / 0.1)` }}
                      >
                        {/* Train Icon */}
                        <Train
                          className="w-6 h-6"
                          style={{ color: `hsl(${colorVar})` }}
                        />
                      </div>
                      <span className="px-2 py-1 text-xs font-mono bg-secondary rounded-md text-muted-foreground">
                        {stationCount} stations
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1 relative z-10">{line}</h3>
                    <p className="text-sm text-muted-foreground relative z-10">Click to view stations</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
