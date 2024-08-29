import express, { json } from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';
import multer, { diskStorage } from 'multer';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const uploadDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Uploads directory created:', uploadDir);
} else {
    console.log('Uploads directory already exists:', uploadDir);
}

const app = express();
app.use(cors());
app.use(json());
app.use('/uploads', express.static(uploadDir));

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tiger',
    database: 'crud_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + extname(file.originalname));
    }
});

const upload = multer({ storage });

app.get('/items', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post('/items', upload.single('image'), (req, res) => {
    console.log('File:', req.file);
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!name || !description) {
        return res.status(400).send('Name and description are required');
    }
    db.query('INSERT INTO items (name, description, image) VALUES (?, ?, ?)', [name, description, image], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.json(results);
    });
});

app.put('/items/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;
    db.query('UPDATE items SET name = ?, description = ?, image = ? WHERE id = ?', [name, description, image, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM items WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.get('/check-file/:filename', (req, res) => {
    const filePath = join(uploadDir, req.params.filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.send('File exists');
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
