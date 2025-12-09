import { useState, useEffect } from 'react';
import { Train, MapPin, Wifi, WifiOff, Activity } from 'lucide-react';
import Header from '@/components/dashboard/Header';
import StatCard from '@/components/dashboard/StatCard';
import StationCard from '@/components/dashboard/StationCard';
import TrainApproachCard from '@/components/dashboard/TrainApproachCard';
import { mockStations, mockTrainApproaches, mockDashboardStats } from '@/data/mockData';
import { TrainApproach } from '@/types/train';

const Index = () => {
  const [approaches, setApproaches] = useState(mockTrainApproaches);
  const [stats, setStats] = useState(mockDashboardStats);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Stations"
            value={stats.totalStations}
            icon={<MapPin className="w-5 h-5" />}
          />
          <StatCard
            title="Train Approaches"
            value={stats.totalApproaches}
            icon={<Train className="w-5 h-5" />}
            subtitle="Last 24 hours"
          />
          <StatCard
            title="Sensors Online"
            value={stats.sensorsOnline}
            icon={<Wifi className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="Sensors Offline"
            value={stats.sensorsOffline}
            icon={<WifiOff className="w-5 h-5" />}
            variant="destructive"
          />
          <StatCard
            title="Active Trains"
            value={stats.activeTrains}
            icon={<Activity className="w-5 h-5" />}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Train Approaches Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Live Train Approaches</h2>
              <span className="text-xs text-muted-foreground font-mono">
                {activeApproaches.length} active
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approaches.map((approach) => (
                <TrainApproachCard key={approach.id} approach={approach} />
              ))}
            </div>
          </div>

          {/* Stations Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Stations</h2>
              <span className="text-xs text-muted-foreground font-mono">
                {mockStations.length} total
              </span>
            </div>
            <div className="space-y-4">
              {mockStations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
