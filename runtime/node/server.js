import express from 'express';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const app = express();
const __dirname = path.resolve();

// ------------------------------------------------------------
//  SQLITE (AXON‑LUMA DATABASE)
// ------------------------------------------------------------
const db = new sqlite3.Database(path.join(__dirname, 'axon-luma.db'), () => {
    console.log('✅ SQLite online');
});

// ------------------------------------------------------------
//  STATIC FILES
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, '../../public')));

// ------------------------------------------------------------
//  FILE LIST ENDPOINT
// ------------------------------------------------------------
app.get('/files', (req, res) => {
    const d = path.join(__dirname, '../../outputs');
    fs.readdir(d, (e, f) => res.json(e ? [] : f));
});

// ------------------------------------------------------------
//  SERVER ONLINE
// ------------------------------------------------------------
app.listen(3000, '0.0.0.0', () => {
    console.log('\n⚡ AXON LUMA GATEWAY ONLINE');
    console.log('   http://localhost:3000\n');
});
