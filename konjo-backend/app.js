require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Frontend Files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public'))); 

// Mock Database 
const usersDB = []; 

// --- REGISTRATION ENDPOINT ---
app.post('/api/register', async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) return res.status(400).json({ message: 'Phone and password are required.' });
        
        const userExists = usersDB.find(u => u.phone === phone);
        if (userExists) return res.status(400).json({ message: 'User already exists.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = { id: Date.now(), phone, password: hashedPassword };
        usersDB.push(newUser);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// --- LOGIN ENDPOINT ---
app.post('/api/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) return res.status(400).json({ message: 'Phone and password are required.' });

        const user = usersDB.find(u => u.phone === phone);
        if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET || 'fallback_secret_key', {
            expiresIn: '1d'
        });

        res.status(200).json({ message: 'Login successful!', token: token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});
// --- X-RAY DEBUG ROUTE ---
app.get('/debug', (req, res) => {
    const fs = require('fs');
    try {
        const mainFiles = fs.readdirSync(__dirname);
        const publicExists = fs.existsSync(path.join(__dirname, 'public'));
        const publicFiles = publicExists ? fs.readdirSync(path.join(__dirname, 'public')) : 'PUBLIC FOLDER IS MISSING!';
        
        res.json({
            message: "Server is awake!",
            currentDirectory: __dirname,
            filesInMainFolder: mainFiles,
            filesInPublicFolder: publicFiles
        });
    } catch (error) {
        res.json({ error: error.message });
    }
});
// --- CATCH-ALL ROUTE (Loads your website) ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
