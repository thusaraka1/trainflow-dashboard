export interface Sensor {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastPing: Date;
}

export interface Station {
  id: string;
  name: string;
  code: string;
  sensors: Sensor[];
  totalApproaches: number;
}

export interface TrainApproach {
  id: string;
  trainId: string;
  stationId: string;
  stationName: string;
  sensorId: string;
  speed: number;
  direction: 'northbound' | 'southbound' | 'eastbound' | 'westbound';
  timestamp: Date;
  status: 'approaching' | 'passed' | 'stopped';
}

export interface DashboardStats {
  totalStations: number;
  totalApproaches: number;
  sensorsOnline: number;
  sensorsOffline: number;
  activeTrains: number;
}
