import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/dashboard/Header";
import { mockLogs } from "@/data/mockData";
import { format } from "date-fns";
import { clsx } from "clsx";

const Logs = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">System Logs</h2>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Timestamp</TableHead>
                                <TableHead className="w-[100px]">Level</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead className="w-[150px]">Source</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-sm">
                                        {format(log.timestamp, "yyyy-MM-dd HH:mm:ss")}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={clsx(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                                                {
                                                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300": log.level === "info",
                                                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300": log.level === "warning",
                                                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300": log.level === "error",
                                                }
                                            )}
                                        >
                                            {log.level}
                                        </span>
                                    </TableCell>
                                    <TableCell>{log.message}</TableCell>
                                    <TableCell className="text-muted-foreground">{log.source}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    );
};

export default Logs;
