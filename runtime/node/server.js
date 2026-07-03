// ============================================================
//  KNOCKSSTUDiOS • AXON‑LUMA
//  Runtime Gateway Server (Node.js)
// ============================================================

import express from 'express';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const __dirname = path.resolve();

// ------------------------------------------------------------
//  MIDDLEWARE
// ------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------
//  SQLITE DATABASE (AXON‑LUMA CORE)
// ------------------------------------------------------------
const dbPath = path.join(__dirname, 'axon-luma.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ SQLite failed:', err);
    } else {
        console.log('✅ SQLite online');
    }
});

// ------------------------------------------------------------
//  STATIC PUBLIC DIRECTORY
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, '../../public')));

// ------------------------------------------------------------
//  GET FILE LIST (OUTPUTS DIRECTORY)
// ------------------------------------------------------------
app.get('/files', (req, res) => {
    const outputDir = path.join(__dirname, '../../outputs');

    fs.readdir(outputDir, (err, files) => {
        if (err) {
            return res.json([]);
        }
        res.json(files);
    });
});

// ------------------------------------------------------------
//  GET SINGLE FILE CONTENT
// ------------------------------------------------------------
app.get('/file/:name', (req, res) => {
    const filePath = path.join(__dirname, '../../outputs', req.params.name);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(404).send('File not found');
        res.send(data);
    });
});

// ------------------------------------------------------------
//  DATABASE TEST ROUTE
// ------------------------------------------------------------
app.get('/db/test', (req, res) => {
    db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, rows) => {
        if (err) return res.json({ error: true });
        res.json(rows);
    });
});

// ------------------------------------------------------------
//  AXON‑LUMA GATEWAY ONLINE
// ------------------------------------------------------------
app.listen(3000, '0.0.0.0', () => {
    console.log('\n⚡ AXON‑LUMA GATEWAY ONLINE');
    console.log('   http://localhost:3000\n');
});
