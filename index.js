const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Source directory (to be copied from)
const sourceBasePath = '/home/vedant/metatrader5/MetaTrader 5/Config';

// Utility function to copy files or directories
function copyRecursiveSync(src, dest) {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
        // Create destination directory if it doesn't exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        // Recursively copy files and subdirectories
        fs.readdirSync(src).forEach((child) => {
            copyRecursiveSync(path.join(src, child), path.join(dest, child));
        });
    } else {
        // Copy individual file
        fs.copyFileSync(src, dest);
    }
}

app.get('/' ,(req,res)=>{
   return res.json("hello server");
})

// API endpoint to copy a directory or file
app.post('/copy-config', (req, res) => {
    console.log('api called');
    const destinationPath = req.query.destination; // Get destination from query parameter

    if (!destinationPath) {
        return res.status(400).send('Destination path is required as a query parameter.');
    }

    try {
        // Copy directory or file
        copyRecursiveSync(sourceBasePath, destinationPath);

        res.send(`Successfully copied from ${sourceBasePath} to ${destinationPath}.`);
    } catch (err) {
        console.error('Error copying files:', err);
        res.status(500).send('Error copying files.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`API is running on http://localhost:${PORT}`);
});
