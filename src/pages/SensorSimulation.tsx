import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Train, ArrowRight, ArrowLeft, Cpu, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface VoltageData {
    x: number;
    y: number;
    z: number;
}

interface SensorData {
    timestamp: number;
    x: number;
    y: number;
    z: number;
    magnitude: number;
    voltage: VoltageData;
}

interface TrainState {
    phase: string;
    direction: string | null;
    speed: number;
    isApproaching: boolean;
}

interface FFTPoint {
    frequency: number;
    magnitude: number;
}

interface FFTData {
    sensorA: { x: FFTPoint[]; y: FFTPoint[]; z: FFTPoint[] };
    sensorB: { x: FFTPoint[]; y: FFTPoint[]; z: FFTPoint[] };
}

const API_URL = 'http://localhost:5000/api';

// Axis configuration for consistent styling
const axisConfig = {
    x: { color: '#22d3ee', name: 'X-Axis', bgGradient: 'from-cyan-500/20' },
    y: { color: '#3b82f6', name: 'Y-Axis', bgGradient: 'from-blue-500/20' },
    z: { color: '#22c55e', name: 'Z-Axis', bgGradient: 'from-green-500/20' },
};

const sensorConfig = {
    A: { color: '#06b6d4', name: 'Sensor A', borderColor: 'border-cyan-500/30' },
    B: { color: '#d946ef', name: 'Sensor B', borderColor: 'border-fuchsia-500/30' },
};

const SensorSimulation = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [sensorAData, setSensorAData] = useState<SensorData[]>([]);
    const [sensorBData, setSensorBData] = useState<SensorData[]>([]);
    const [fftData, setFftData] = useState<FFTData | null>(null);
    const [trainState, setTrainState] = useState<TrainState>({
        phase: 'idle', direction: null, speed: 0, isApproaching: false,
    });
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected'>('disconnected');
    const eventSourceRef = useRef<EventSource | null>(null);
    const fftIntervalRef = useRef<number | null>(null);
    const maxDataPoints = 256;
    const sampleRate = 50;

    const connectToStream = () => {
        if (eventSourceRef.current) eventSourceRef.current.close();
        const eventSource = new EventSource(`${API_URL}/simulation/stream`);
        eventSourceRef.current = eventSource;
        eventSource.onopen = () => setConnectionStatus('connected');
        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'data') {
                const { sensorA, sensorB, trainState: state } = message.data;
                setSensorAData(prev => [...prev, sensorA].slice(-maxDataPoints));
                setSensorBData(prev => [...prev, sensorB].slice(-maxDataPoints));
                setTrainState(state);
            } else if (message.type === 'status') {
                setIsRunning(message.data.isRunning);
            }
        };
        eventSource.onerror = () => { setConnectionStatus('disconnected'); eventSource.close(); };
    };

    const fetchFFT = async () => {
        try {
            const response = await fetch(`${API_URL}/simulation/fft`);
            const result = await response.json();
            if (result.success && result.data) {
                setFftData(result.data);
            }
        } catch (error) {
            console.error('FFT fetch error:', error);
        }
    };

    const startSimulation = async () => {
        await fetch(`${API_URL}/simulation/start`, { method: 'POST' });
        setIsRunning(true);
        connectToStream();
        // Poll FFT data every 500ms (simulating DSP PIC output)
        fftIntervalRef.current = window.setInterval(fetchFFT, 500);
    };

    const stopSimulation = async () => {
        await fetch(`${API_URL}/simulation/stop`, { method: 'POST' });
        setIsRunning(false);
        eventSourceRef.current?.close();
        if (fftIntervalRef.current) clearInterval(fftIntervalRef.current);
        setConnectionStatus('disconnected');
    };

    const triggerTrain = async (direction?: string) => {
        await fetch(`${API_URL}/simulation/trigger-train`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction }),
        });
    };

    useEffect(() => {
        return () => {
            eventSourceRef.current?.close();
            if (fftIntervalRef.current) clearInterval(fftIntervalRef.current);
        };
    }, []);

    // Prepare time-domain data for each axis
    const prepareTimeData = (data: SensorData[], axis: 'x' | 'y' | 'z') =>
        data.map((d, i) => ({ time: i * (1000 / sampleRate), amplitude: d[axis] }));

    // Get latest voltage readings
    const latestVoltageA = sensorAData.length > 0 ? sensorAData[sensorAData.length - 1].voltage : { x: 1.65, y: 1.65, z: 1.65 };
    const latestVoltageB = sensorBData.length > 0 ? sensorBData[sensorBData.length - 1].voltage : { x: 1.65, y: 1.65, z: 1.65 };

    const getPhaseColor = (phase: string) => {
        switch (phase) {
            case 'approaching': return 'bg-yellow-500';
            case 'passing': return 'bg-red-500';
            case 'departing': return 'bg-orange-500';
            default: return 'bg-green-500';
        }
    };

    // Voltage bar component
    const VoltageBar = ({ voltage, color }: { voltage: number; color: string }) => {
        const percentage = (voltage / 3.3) * 100;
        return (
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-100"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                />
            </div>
        );
    };

    // Time-domain chart component
    const TimeChart = ({ data, axis, sensor }: { data: SensorData[]; axis: 'x' | 'y' | 'z'; sensor: 'A' | 'B' }) => {
        const timeData = prepareTimeData(data, axis);
        const config = axisConfig[axis];
        return (
            <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#666" fontSize={9} tickFormatter={v => `${(v / 1000).toFixed(1)}s`} />
                        <YAxis stroke="#666" fontSize={9} domain={[-20000, 70000]} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                        <Line type="monotone" dataKey="amplitude" stroke={config.color} strokeWidth={1} dot={false} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    // FFT chart component
    const FFTChart = ({ data, color }: { data: FFTPoint[] | undefined; color: string }) => {
        if (!data || data.length === 0) {
            return (
                <div className="h-[80px] flex items-center justify-center text-gray-500 text-xs">
                    Waiting for DSP PIC data...
                </div>
            );
        }
        return (
            <div className="h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="frequency" stroke="#666" fontSize={8} tickFormatter={v => `${v}`} />
                        <YAxis stroke="#666" fontSize={8} domain={[0, 'auto']} />
                        <Area type="monotone" dataKey="magnitude" stroke={color} fill={color} fillOpacity={0.3} isAnimationActive={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    };

    // Sensor panel component
    const SensorPanel = ({
        sensor,
        data,
        voltage,
        fft
    }: {
        sensor: 'A' | 'B';
        data: SensorData[];
        voltage: VoltageData;
        fft: { x: FFTPoint[]; y: FFTPoint[]; z: FFTPoint[] } | undefined;
    }) => {
        const config = sensorConfig[sensor];
        return (
            <div className={`space-y-3 p-3 rounded-xl border ${config.borderColor} bg-gradient-to-br from-gray-900/50 to-gray-800/30`}>
                {/* Sensor Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" style={{ color: config.color }} />
                        <span className="font-semibold text-sm" style={{ color: config.color }}>{config.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">ADXL335</Badge>
                    </div>
                </div>

                {/* Voltage Indicators */}
                <Card className="bg-[#0d1321] border-gray-700/50">
                    <CardContent className="p-2">
                        <div className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1">
                            <Cpu className="w-3 h-3" /> Analog Output (0-3.3V)
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(['x', 'y', 'z'] as const).map((axis) => (
                                <div key={axis} className="space-y-1">
                                    <div className="flex justify-between text-[10px]">
                                        <span style={{ color: axisConfig[axis].color }}>{axis.toUpperCase()}</span>
                                        <span className="text-gray-300 font-mono">{voltage[axis].toFixed(3)}V</span>
                                    </div>
                                    <VoltageBar voltage={voltage[axis]} color={axisConfig[axis].color} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Time Domain Charts */}
                {(['x', 'y', 'z'] as const).map((axis) => (
                    <Card key={axis} className="bg-[#16213e] border-0">
                        <CardHeader className="py-1.5 px-3">
                            <CardTitle className="text-xs" style={{ color: axisConfig[axis].color }}>
                                {axisConfig[axis].name} - Time Domain (Amplitude vs Time)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-1.5">
                            <TimeChart data={data} axis={axis} sensor={sensor} />
                        </CardContent>
                    </Card>
                ))}

                {/* FFT Charts */}
                <Card className="bg-[#1a1a2e] border-0">
                    <CardHeader className="py-1.5 px-3">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-3 h-3 text-purple-400" />
                            <CardTitle className="text-xs text-purple-400">DSP PIC FFT Results (Frequency Domain)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2 space-y-2">
                        {(['x', 'y', 'z'] as const).map((axis) => (
                            <div key={axis}>
                                <div className="text-[10px] mb-1" style={{ color: axisConfig[axis].color }}>
                                    {axisConfig[axis].name} FFT
                                </div>
                                <FFTChart data={fft?.[axis]} color={axisConfig[axis].color} />
                            </div>
                        ))}
                        <div className="text-center text-[9px] text-gray-500">Frequency (Hz)</div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d1321] via-[#1a1a2e] to-[#16213e] p-4">
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between bg-[#16213e]/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <Train className="w-6 h-6 text-blue-400" />
                            Train Vibration Detection System
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            ADXL335 Accelerometer × 2 | DSP PIC FFT Analysis | 500 Hz Sample Rate
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge
                            variant={connectionStatus === 'connected' ? 'default' : 'secondary'}
                            className={connectionStatus === 'connected' ? 'bg-green-600' : ''}
                        >
                            {connectionStatus === 'connected' ? '● Live' : '○ Offline'}
                        </Badge>
                        {!isRunning ? (
                            <Button onClick={startSimulation} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                                <Play className="w-4 h-4 mr-1" /> Start Simulation
                            </Button>
                        ) : (
                            <Button onClick={stopSimulation} variant="destructive" size="sm">
                                <Square className="w-4 h-4 mr-1" /> Stop
                            </Button>
                        )}
                    </div>
                </div>

                {/* Train Status Bar */}
                <div className="flex items-center justify-between bg-[#16213e]/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700/20">
                    <div className="flex items-center gap-4">
                        <Train className="w-5 h-5 text-blue-400" />
                        <Badge className={`${getPhaseColor(trainState.phase)} text-white px-3`}>
                            {trainState.phase.toUpperCase()}
                        </Badge>
                        {trainState.direction && (
                            <span className="text-xs text-gray-400">
                                Direction: {trainState.direction === 'left-to-right' ? '→ East' : '← West'}
                            </span>
                        )}
                        {trainState.speed > 0 && (
                            <span className="text-sm text-white font-mono">{trainState.speed.toFixed(0)} km/h</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => triggerTrain('left-to-right')}
                            disabled={!isRunning || trainState.phase !== 'idle'}
                            size="sm"
                            variant="outline"
                            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                        >
                            <ArrowRight className="w-4 h-4 mr-1" /> Train East
                        </Button>
                        <Button
                            onClick={() => triggerTrain('right-to-left')}
                            disabled={!isRunning || trainState.phase !== 'idle'}
                            size="sm"
                            variant="outline"
                            className="border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/20"
                        >
                            Train West <ArrowLeft className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>

                {/* Sensor Panels - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SensorPanel
                        sensor="A"
                        data={sensorAData}
                        voltage={latestVoltageA}
                        fft={fftData?.sensorA}
                    />
                    <SensorPanel
                        sensor="B"
                        data={sensorBData}
                        voltage={latestVoltageB}
                        fft={fftData?.sensorB}
                    />
                </div>

                {/* Info Footer */}
                <div className="text-xs text-gray-500 text-center space-y-1 py-2">
                    <p>ADXL335: ±3g Range | 0-3.3V Analog Output | 330mV/g Sensitivity | 1.65V Zero-g</p>
                    <p>DSP PIC FFT: 256-point Window | 10-500 Hz Analysis Range</p>
                </div>
            </div>
        </div>
    );
};

export default SensorSimulation;
