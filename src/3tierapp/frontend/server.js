const express = require('express');
const path = require('path');
const app = express();

// 1. Serve your static HTML file to the browser
app.use(express.static(path.join(__dirname, 'public')));

// 2. Create a local endpoint that calls the app layer privately
app.get('/local-users', async (req, res) => {
    try {
        // The web server makes the request to the App tier internally
        const response = await fetch(`http://${process.env.APPSERVER}:5000/api/users`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to communicate with App tier' });
    }
});

// Run this web tier on standard port 80 (or 3080 if 80 is busy)
app.listen(80, () => {
    console.log('Web tier running on port 80');
});