import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStations } from '@/data/mockData';
import { ArrowLeft, TrainTrack, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from "@/lib/utils";
import Header from '@/components/dashboard/Header';
import StationCard from '@/components/dashboard/StationCard';

const LineStations = () => {
    const { lineName } = useParams();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    // Decode line name if necessary (though react router handles %20 mostly)
    const decodedLineName = lineName ? decodeURIComponent(lineName) : '';

    const lineStations = mockStations.filter((s) => s.line === decodedLineName);
    const sortedStations = [...lineStations].sort((a, b) => a.name.localeCompare(b.name));

    if (lineStations.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                    <h2 className="text-2xl font-bold mb-4">Line Not Found or No Stations</h2>
                    <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:pl-2 transition-all"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10">
                            <TrainTrack className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{decodedLineName}</h1>
                            <p className="text-muted-foreground">{lineStations.length} Stations</p>
                        </div>
                    </div>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full md:w-[300px] justify-between glass"
                            >
                                {value
                                    ? lineStations.find((station) => station.name === value)?.name
                                    : "Search station..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder="Search station..." />
                                <CommandList>
                                    <CommandEmpty>No station found.</CommandEmpty>
                                    <CommandGroup>
                                        {sortedStations.map((station) => (
                                            <CommandItem
                                                key={station.id}
                                                value={station.name}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue);
                                                    setOpen(false);
                                                    const element = document.getElementById(`station-${station.id}`);
                                                    if (element) {
                                                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background');
                                                        setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background'), 2500);
                                                    }
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === station.name ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {station.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lineStations.map((station, index) => (
                        <StationCard
                            key={station.id}
                            station={station}
                            colorIndex={(index % 5) + 1}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LineStations;
