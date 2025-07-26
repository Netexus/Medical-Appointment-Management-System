-- Database schema for medical appointment management
CREATE DATABASE IF NOT EXISTS vida_sana;
USE vida_sana;

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('M','F','Other') NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(200),
    blood_type VARCHAR(5)
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    years_experience INT,
    salary DECIMAL(10,2)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('pending','completed','canceled') DEFAULT 'pending',
    patient_id INT,
    doctor_id INT,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    description TEXT NOT NULL,
    indications TEXT,
    prescription TEXT,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);
