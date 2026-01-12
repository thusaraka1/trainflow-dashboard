const bcrypt = require('bcryptjs');

// In-memory user storage (no MongoDB required)
const users = [];

// Create default admin user
const initializeUsers = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    users.push({
        _id: '1',
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date()
    });

    console.log('Default admin user created (username: admin, password: admin123)');
};

// Initialize on module load
initializeUsers();

// Find user by username
const findByUsername = (username) => {
    return users.find(user => user.username === username);
};

// Find user by ID
const findById = (id) => {
    return users.find(user => user._id === id);
};

// Create new user
const createUser = async (username, password) => {
    const existingUser = findByUsername(username);
    if (existingUser) {
        return null;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        _id: String(users.length + 1),
        username,
        password: hashedPassword,
        createdAt: new Date()
    };

    users.push(newUser);
    return newUser;
};

// Match password
const matchPassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = {
    findByUsername,
    findById,
    createUser,
    matchPassword
};
