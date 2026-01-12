const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Station = require('../models/Station');
const TrainApproach = require('../models/TrainApproach');
const Log = require('../models/Log');

dotenv.config();

// All station data from mockData.ts
const stationsData = [
    { stationId: '1', name: 'Maradana', code: 'MAR', province: 'Unknown', line: 'Main Line', totalApproaches: 69 },
    { stationId: '2', name: 'Dematagoda', code: 'DEM', province: 'Unknown', line: 'Main Line', totalApproaches: 46 },
    { stationId: '3', name: 'Kelaniya', code: 'KEL', province: 'Unknown', line: 'Main Line', totalApproaches: 64 },
    { stationId: '4', name: 'Wanawasala', code: 'WAN', province: 'Unknown', line: 'Main Line', totalApproaches: 66 },
    { stationId: '5', name: 'Hunupitiya', code: 'HUN', province: 'Unknown', line: 'Main Line', totalApproaches: 39 },
    { stationId: '6', name: 'Enderamulla', code: 'END', province: 'Unknown', line: 'Main Line', totalApproaches: 99 },
    { stationId: '7', name: 'Horape', code: 'HOR', province: 'Unknown', line: 'Main Line', totalApproaches: 62 },
    { stationId: '8', name: 'Ragama', code: 'RAG', province: 'Unknown', line: 'Main Line', totalApproaches: 85 },
    { stationId: '9', name: 'Walpola', code: 'WAL', province: 'Unknown', line: 'Main Line', totalApproaches: 60 },
    { stationId: '10', name: 'Batuwatte', code: 'BAT', province: 'Unknown', line: 'Main Line', totalApproaches: 52 },
    { stationId: '11', name: 'Bulugahagoda', code: 'BUL', province: 'Unknown', line: 'Main Line', totalApproaches: 22 },
    { stationId: '12', name: 'Ganemulla', code: 'GAN', province: 'Unknown', line: 'Main Line', totalApproaches: 56 },
    { stationId: '13', name: 'Yagoda', code: 'YAG', province: 'Unknown', line: 'Main Line', totalApproaches: 10 },
    { stationId: '14', name: 'Gampaha', code: 'GAM', province: 'Unknown', line: 'Main Line', totalApproaches: 41 },
    { stationId: '15', name: 'Daraluwa', code: 'DAR', province: 'Unknown', line: 'Main Line', totalApproaches: 15 },
    { stationId: '16', name: 'Bemmulla', code: 'BEM', province: 'Unknown', line: 'Main Line', totalApproaches: 13 },
    { stationId: '17', name: 'Magelegoda', code: 'MAG', province: 'Unknown', line: 'Main Line', totalApproaches: 21 },
    { stationId: '18', name: 'Heendeniya', code: 'HEE', province: 'Unknown', line: 'Main Line', totalApproaches: 78 },
    { stationId: '19', name: 'Veyangoda', code: 'VEY', province: 'Unknown', line: 'Main Line', totalApproaches: 58 },
    { stationId: '20', name: 'Wandurawa', code: 'WAN', province: 'Unknown', line: 'Main Line', totalApproaches: 109 },
    { stationId: '21', name: 'Keenawala', code: 'KEE', province: 'Unknown', line: 'Main Line', totalApproaches: 78 },
    { stationId: '22', name: 'Pallewala', code: 'PAL', province: 'Unknown', line: 'Main Line', totalApproaches: 41 },
    { stationId: '23', name: 'Ganegoda', code: 'GAN', province: 'Unknown', line: 'Main Line', totalApproaches: 13 },
    { stationId: '24', name: 'Wijayarajadahana', code: 'WIJ', province: 'Unknown', line: 'Main Line', totalApproaches: 24 },
    { stationId: '25', name: 'Mihirigama', code: 'MIH', province: 'Unknown', line: 'Main Line', totalApproaches: 46 },
    { stationId: '26', name: 'Wilwatte', code: 'WIL', province: 'Unknown', line: 'Main Line', totalApproaches: 65 },
    { stationId: '27', name: 'Botale', code: 'BOT', province: 'Unknown', line: 'Main Line', totalApproaches: 62 },
    { stationId: '28', name: 'Abeypussa', code: 'ABE', province: 'Unknown', line: 'Main Line', totalApproaches: 76 },
    { stationId: '29', name: 'Yattalgoda', code: 'YAT', province: 'Unknown', line: 'Main Line', totalApproaches: 84 },
    { stationId: '30', name: 'Buthgamuwa', code: 'BUT', province: 'Unknown', line: 'Main Line', totalApproaches: 90 },
    { stationId: '31', name: 'Alawwa', code: 'ALA', province: 'Unknown', line: 'Main Line', totalApproaches: 86 },
    { stationId: '32', name: 'Wlakubura', code: 'WLA', province: 'Unknown', line: 'Main Line', totalApproaches: 70 },
    { stationId: '33', name: 'Poplgahawela', code: 'POP', province: 'Unknown', line: 'Main Line', totalApproaches: 45 },
    { stationId: '34', name: 'Panaleeya', code: 'PAN', province: 'Unknown', line: 'Main Line', totalApproaches: 29 },
    { stationId: '35', name: 'Tismalpola', code: 'TIS', province: 'Unknown', line: 'Main Line', totalApproaches: 92 },
    { stationId: '36', name: 'Yatagama', code: 'YAT', province: 'Unknown', line: 'Main Line', totalApproaches: 12 },
    { stationId: '37', name: 'Rambukkana', code: 'RAM', province: 'Unknown', line: 'Main Line', totalApproaches: 49 },
    { stationId: '38', name: 'Kadigamuwa', code: 'KAD', province: 'Unknown', line: 'Main Line', totalApproaches: 63 },
    { stationId: '39', name: 'Gangoda', code: 'GAN', province: 'Unknown', line: 'Main Line', totalApproaches: 42 },
    { stationId: '40', name: 'Ihalakotte', code: 'IHA', province: 'Unknown', line: 'Main Line', totalApproaches: 45 },
    { stationId: '41', name: 'Balana', code: 'BAL', province: 'Unknown', line: 'Main Line', totalApproaches: 109 },
    { stationId: '42', name: 'Kadugannawa', code: 'KAD', province: 'Unknown', line: 'Main Line', totalApproaches: 33 },
    { stationId: '43', name: 'Pilimatalawa', code: 'PIL', province: 'Unknown', line: 'Main Line', totalApproaches: 91 },
    { stationId: '44', name: 'Peradeniya', code: 'PER', province: 'Unknown', line: 'Main Line', totalApproaches: 91 },
    { stationId: '45', name: 'Koshinna', code: 'KOS', province: 'Unknown', line: 'Main Line', totalApproaches: 38 },
    { stationId: '46', name: 'Gelioya', code: 'GEL', province: 'Unknown', line: 'Main Line', totalApproaches: 72 },
    { stationId: '47', name: 'Gampola', code: 'GAM', province: 'Unknown', line: 'Main Line', totalApproaches: 107 },
    { stationId: '48', name: 'Tembligala', code: 'TEM', province: 'Unknown', line: 'Main Line', totalApproaches: 92 },
    { stationId: '49', name: 'Ulapone', code: 'ULA', province: 'Unknown', line: 'Main Line', totalApproaches: 66 },
    { stationId: '50', name: 'Nawalapitiya', code: 'NAW', province: 'Unknown', line: 'Main Line', totalApproaches: 18 },
    { stationId: '51', name: 'Inguruoya', code: 'ING', province: 'Unknown', line: 'Main Line', totalApproaches: 19 },
    { stationId: '52', name: 'Galaboda', code: 'GAL', province: 'Unknown', line: 'Main Line', totalApproaches: 94 },
    { stationId: '53', name: 'Watawala', code: 'WAT', province: 'Unknown', line: 'Main Line', totalApproaches: 42 },
    { stationId: '54', name: 'Ihalawatawala', code: 'IHA', province: 'Unknown', line: 'Main Line', totalApproaches: 85 },
    { stationId: '55', name: 'Rosella', code: 'ROS', province: 'Unknown', line: 'Main Line', totalApproaches: 41 },
    { stationId: '56', name: 'Hatton', code: 'HAT', province: 'Unknown', line: 'Main Line', totalApproaches: 20 },
    { stationId: '57', name: 'Kotagala', code: 'KOT', province: 'Unknown', line: 'Main Line', totalApproaches: 82 },
    { stationId: '58', name: 'Talawakele', code: 'TAL', province: 'Unknown', line: 'Main Line', totalApproaches: 96 },
    { stationId: '59', name: 'Watagoda', code: 'WAT', province: 'Unknown', line: 'Main Line', totalApproaches: 65 },
    { stationId: '60', name: 'Greatwestern', code: 'GRE', province: 'Unknown', line: 'Main Line', totalApproaches: 91 },
    { stationId: '61', name: 'Radella', code: 'RAD', province: 'Unknown', line: 'Main Line', totalApproaches: 69 },
    { stationId: '62', name: 'Nanuoya', code: 'NAN', province: 'Unknown', line: 'Main Line', totalApproaches: 10 },
    { stationId: '63', name: 'Perakumpura', code: 'PER', province: 'Unknown', line: 'Main Line', totalApproaches: 40 },
    { stationId: '64', name: 'Ambewela', code: 'AMB', province: 'Unknown', line: 'Main Line', totalApproaches: 54 },
    { stationId: '65', name: 'Pattipola', code: 'PAT', province: 'Unknown', line: 'Main Line', totalApproaches: 61 },
    { stationId: '66', name: 'Ohiya', code: 'OHI', province: 'Unknown', line: 'Main Line', totalApproaches: 63 },
    { stationId: '67', name: 'Idalgasinna', code: 'IDA', province: 'Unknown', line: 'Main Line', totalApproaches: 95 },
    { stationId: '68', name: 'Haputale', code: 'HAP', province: 'Unknown', line: 'Main Line', totalApproaches: 96 },
    { stationId: '69', name: 'Deyatalawa', code: 'DEY', province: 'Unknown', line: 'Main Line', totalApproaches: 24 },
    { stationId: '70', name: 'Bandarawela', code: 'BAN', province: 'Unknown', line: 'Main Line', totalApproaches: 108 },
    { stationId: '71', name: 'Kinigama', code: 'KIN', province: 'Unknown', line: 'Main Line', totalApproaches: 13 },
    { stationId: '72', name: 'Heeloya', code: 'HEE', province: 'Unknown', line: 'Main Line', totalApproaches: 32 },
    { stationId: '73', name: 'Kitalelle', code: 'KIT', province: 'Unknown', line: 'Main Line', totalApproaches: 95 },
    { stationId: '74', name: 'Elle', code: 'ELL', province: 'Unknown', line: 'Main Line', totalApproaches: 25 },
    { stationId: '75', name: 'Demodara', code: 'DEM', province: 'Unknown', line: 'Main Line', totalApproaches: 102 },
    { stationId: '76', name: 'Uduwara', code: 'UDU', province: 'Unknown', line: 'Main Line', totalApproaches: 24 },
    { stationId: '77', name: 'Haliela', code: 'HAL', province: 'Unknown', line: 'Main Line', totalApproaches: 95 },
    { stationId: '78', name: 'Badulla', code: 'BAD', province: 'Unknown', line: 'Main Line', totalApproaches: 66 },
    // Puttalam Line
    { stationId: '79', name: 'Peralanda', code: 'PER', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 10 },
    { stationId: '80', name: 'Kandana', code: 'KAN', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 99 },
    { stationId: '81', name: 'Kapuwatte', code: 'KAP', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 22 },
    { stationId: '82', name: 'Ja-Ela', code: 'JAX', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 91 },
    { stationId: '83', name: 'Tudella', code: 'TUD', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 76 },
    { stationId: '84', name: 'Alawathupitiya', code: 'ALA', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 45 },
    { stationId: '85', name: 'Seeduwa', code: 'SEE', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 88 },
    { stationId: '86', name: 'Liyanagemulla', code: 'LIY', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 33 },
    { stationId: '87', name: 'Katunayake South', code: 'KAS', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 55 },
    { stationId: '88', name: 'Katunayake', code: 'KAT', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 77 },
    { stationId: '89', name: 'Kurana', code: 'KUR', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 44 },
    { stationId: '90', name: 'Negombo', code: 'NEG', province: 'Unknown', line: 'Puttalam Line', totalApproaches: 120 },
    // Coastal Line sample
    { stationId: '91', name: 'Fort', code: 'FRT', province: 'Western', line: 'Coastal Line', totalApproaches: 150 },
    { stationId: '92', name: 'Secretariat', code: 'SEC', province: 'Western', line: 'Coastal Line', totalApproaches: 80 },
    { stationId: '93', name: 'Kollupitiya', code: 'KOL', province: 'Western', line: 'Coastal Line', totalApproaches: 95 },
    { stationId: '94', name: 'Bambalapitiya', code: 'BAM', province: 'Western', line: 'Coastal Line', totalApproaches: 88 },
    { stationId: '95', name: 'Wellawatte', code: 'WEL', province: 'Western', line: 'Coastal Line', totalApproaches: 92 },
    { stationId: '96', name: 'Dehiwala', code: 'DEH', province: 'Western', line: 'Coastal Line', totalApproaches: 110 },
    { stationId: '97', name: 'Mount Lavinia', code: 'MLV', province: 'Western', line: 'Coastal Line', totalApproaches: 105 },
    { stationId: '98', name: 'Ratmalana', code: 'RAT', province: 'Western', line: 'Coastal Line', totalApproaches: 78 },
    { stationId: '99', name: 'Moratuwa', code: 'MOR', province: 'Western', line: 'Coastal Line', totalApproaches: 115 },
    { stationId: '100', name: 'Panadura', code: 'PAN', province: 'Western', line: 'Coastal Line', totalApproaches: 98 },
];

// Add sensors to each station
const addSensors = (station) => {
    return {
        ...station,
        sensors: [
            { sensorId: `s${station.stationId}-1`, name: 'Sensor 1', status: 'online', lastPing: new Date() },
            { sensorId: `s${station.stationId}-2`, name: 'Sensor 2', status: 'online', lastPing: new Date() }
        ]
    };
};

// Sample train approaches
const trainApproachesData = [
    { trainId: 'TRN-4521', stationId: '1', stationName: 'Maradana', sensorId: 's1-1', speed: 85, distance: 12.5, destination: 'Kandy', status: 'approaching' },
    { trainId: 'TRN-3347', stationId: '1', stationName: 'Maradana', sensorId: 's1-2', speed: 78, distance: 8.0, destination: 'Galle', status: 'passed' },
    { trainId: 'TRN-2156', stationId: '2', stationName: 'Dematagoda', sensorId: 's2-1', speed: 65, distance: 5.2, destination: 'Colombo', status: 'approaching' },
    { trainId: 'TRN-7788', stationId: '3', stationName: 'Kelaniya', sensorId: 's3-1', speed: 72, distance: 3.1, destination: 'Badulla', status: 'approaching' },
    { trainId: 'TRN-9901', stationId: '91', stationName: 'Fort', sensorId: 's91-1', speed: 55, distance: 1.5, destination: 'Matara', status: 'approaching' },
];

// Sample logs
const logsData = [
    { level: 'info', message: 'System started successfully', source: 'Server' },
    { level: 'info', message: 'Database connected', source: 'MongoDB' },
    { level: 'info', message: 'MQTT connected to HiveMQ', source: 'MQTT' },
    { level: 'warning', message: 'High traffic detected on Main Line', source: 'TrainMonitor' },
    { level: 'info', message: 'Sensor s1-1 ping received', source: 'Sensor' },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await Station.deleteMany({});
        await TrainApproach.deleteMany({});
        await Log.deleteMany({});
        console.log('Cleared existing data');

        // Insert stations with sensors
        const stationsWithSensors = stationsData.map(addSensors);
        await Station.insertMany(stationsWithSensors);
        console.log(`Inserted ${stationsWithSensors.length} stations`);

        // Insert train approaches
        await TrainApproach.insertMany(trainApproachesData);
        console.log(`Inserted ${trainApproachesData.length} train approaches`);

        // Insert logs
        await Log.insertMany(logsData);
        console.log(`Inserted ${logsData.length} logs`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
