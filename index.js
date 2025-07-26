// Basic backend for medical appointment management
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change to your MySQL user
    password: 'Qwe.123*', // Change to your MySQL password
    database: 'vida_sana'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Basic example route
app.get('/', (req, res) => {
    res.send('Medical appointment management API is running');
});

// Patient registration endpoint
app.post('/patients', (req, res) => {
    const { full_name, birth_date, gender, contact_number, email, address, blood_type } = req.body;

    // Basic validation
    if (!full_name || !birth_date || !gender) {
        return res.status(400).json({ error: 'full_name, birth_date, and gender are required.' });
    }

    const sql = `INSERT INTO patients (full_name, birth_date, gender, contact_number, email, address, blood_type)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [full_name, birth_date, gender, contact_number, email, address, blood_type];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting patient:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        // Return the new patient with its ID
        res.status(201).json({
            message: 'Patient registered successfully.',
            patient: {
                id: result.insertId,
                full_name,
                birth_date,
                gender,
                contact_number,
                email,
                address,
                blood_type
            }
        });
    });
});

// Doctor registration endpoint
app.post('/doctors', (req, res) => {
    const { full_name, specialty, phone, email, years_experience, salary } = req.body;

    // Basic validation
    if (!full_name || !specialty) {
        return res.status(400).json({ error: 'full_name and specialty are required.' });
    }

    const sql = `INSERT INTO doctors (full_name, specialty, phone, email, years_experience, salary)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [full_name, specialty, phone, email, years_experience, salary];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting doctor:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        // Return the new doctor with its ID
        res.status(201).json({
            message: 'Doctor registered successfully.',
            doctor: {
                id: result.insertId,
                full_name,
                specialty,
                phone,
                email,
                years_experience,
                salary
            }
        });
    });
});

// Appointment scheduling endpoint
app.post('/appointments', (req, res) => {
    const { date, time, reason} = req.body;

    // Basic validation
    if (!date || !time || !reason) {
        return res.status(400).json({ error: 'date, time and reason are required.' });
    }

    const sql = `INSERT INTO appointments (date, time, reason)
                 VALUES (?, ?, ?)`;
    const values = [date, time, reason];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error scheduling appointment:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({
            message: 'Appointment scheduled successfully.',
            appointment: {
                id: result.insertId,
                date,
                time,
                reason,
                status: 'pending'
            }
        });
    });
});

// Appointment status update endpoint
app.put('/appointments/:id/status', (req, res) => {
    const appointmentId = req.params.id;
    const { status } = req.body;
    const validStatuses = ['pending', 'completed', 'canceled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
    }

    const sql = `UPDATE appointments SET status = ? WHERE id = ?`;
    db.query(sql, [status, appointmentId], (err, result) => {
        if (err) {
            console.error('Error updating appointment status:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }
        res.json({ message: 'Appointment status updated successfully.', appointment_id: appointmentId, status });
    });
});

// Diagnosis recording endpoint
app.post('/diagnoses', (req, res) => {
    const { appointment_id, description, indications, prescription } = req.body;

    // Basic validation
    if (!appointment_id || !description) {
        return res.status(400).json({ error: 'appointment_id and description are required.' });
    }

    // Check if appointment exists and is completed
    const checkSql = 'SELECT status FROM appointments WHERE id = ?';
    db.query(checkSql, [appointment_id], (err, results) => {
        if (err) {
            console.error('Error checking appointment:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }
        if (results[0].status !== 'completed') {
            return res.status(400).json({ error: 'Diagnosis can only be recorded for completed appointments.' });
        }

        // Insert diagnosis
        const insertSql = `INSERT INTO diagnoses (appointment_id, description, indications, prescription)
                           VALUES (?, ?, ?, ?)`;
        const values = [appointment_id, description, indications, prescription];

        db.query(insertSql, values, (err, result) => {
            if (err) {
                console.error('Error recording diagnosis:', err);
                return res.status(500).json({ error: 'Database error.' });
            }
            res.status(201).json({
                message: 'Diagnosis recorded successfully.',
                diagnosis: {
                    id: result.insertId,
                    appointment_id,
                    description,
                    indications,
                    prescription
                }
            });
        });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});
