import { Station, TrainApproach, DashboardStats } from '@/types/train';

export const mockStations: Station[] = [
  {
    id: '1',
    name: 'Central Station',
    code: 'CTR',
    sensors: [
      { id: 's1', name: 'Sensor A1', status: 'online', lastPing: new Date() },
      { id: 's2', name: 'Sensor A2', status: 'online', lastPing: new Date() },
      { id: 's3', name: 'Sensor B1', status: 'offline', lastPing: new Date(Date.now() - 3600000) },
    ],
    totalApproaches: 142,
  },
  {
    id: '2',
    name: 'North Terminal',
    code: 'NTH',
    sensors: [
      { id: 's4', name: 'Sensor N1', status: 'online', lastPing: new Date() },
      { id: 's5', name: 'Sensor N2', status: 'online', lastPing: new Date() },
    ],
    totalApproaches: 89,
  },
  {
    id: '3',
    name: 'South Junction',
    code: 'STH',
    sensors: [
      { id: 's6', name: 'Sensor S1', status: 'online', lastPing: new Date() },
      { id: 's7', name: 'Sensor S2', status: 'offline', lastPing: new Date(Date.now() - 7200000) },
      { id: 's8', name: 'Sensor S3', status: 'online', lastPing: new Date() },
    ],
    totalApproaches: 67,
  },
  {
    id: '4',
    name: 'East Bridge',
    code: 'EST',
    sensors: [
      { id: 's9', name: 'Sensor E1', status: 'online', lastPing: new Date() },
      { id: 's10', name: 'Sensor E2', status: 'online', lastPing: new Date() },
    ],
    totalApproaches: 54,
  },
  {
    id: '5',
    name: 'West Depot',
    code: 'WST',
    sensors: [
      { id: 's11', name: 'Sensor W1', status: 'offline', lastPing: new Date(Date.now() - 1800000) },
      { id: 's12', name: 'Sensor W2', status: 'online', lastPing: new Date() },
    ],
    totalApproaches: 38,
  },
];

export const mockTrainApproaches: TrainApproach[] = [
  {
    id: 'ta1',
    trainId: 'TRN-4521',
    stationId: '1',
    stationName: 'Central Station',
    sensorId: 's1',
    speed: 85,
    direction: 'northbound',
    timestamp: new Date(),
    status: 'approaching',
  },
  {
    id: 'ta2',
    trainId: 'TRN-7832',
    stationId: '2',
    stationName: 'North Terminal',
    sensorId: 's4',
    speed: 62,
    direction: 'southbound',
    timestamp: new Date(Date.now() - 120000),
    status: 'approaching',
  },
  {
    id: 'ta3',
    trainId: 'TRN-1194',
    stationId: '3',
    stationName: 'South Junction',
    sensorId: 's6',
    speed: 0,
    direction: 'westbound',
    timestamp: new Date(Date.now() - 300000),
    status: 'stopped',
  },
  {
    id: 'ta4',
    trainId: 'TRN-9956',
    stationId: '4',
    stationName: 'East Bridge',
    sensorId: 's9',
    speed: 95,
    direction: 'eastbound',
    timestamp: new Date(Date.now() - 60000),
    status: 'approaching',
  },
  {
    id: 'ta5',
    trainId: 'TRN-3347',
    stationId: '1',
    stationName: 'Central Station',
    sensorId: 's2',
    speed: 78,
    direction: 'southbound',
    timestamp: new Date(Date.now() - 180000),
    status: 'passed',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalStations: 5,
  totalApproaches: 390,
  sensorsOnline: 9,
  sensorsOffline: 3,
  activeTrains: 4,
};
