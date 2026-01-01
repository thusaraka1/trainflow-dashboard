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
  province?: string;
  line?: string;
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
  distance: number;
  destination: string;
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

export interface Log {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}
