// JavaScript for basic UI interaction and API calls
function showSection(sectionId) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = '';
}

// Patient registration
const patientForm = document.getElementById('patientForm');
if (patientForm) {
    patientForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(patientForm));
        const res = await fetch('http://localhost:3001/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        document.getElementById('patientResult').textContent = data.message || data.error;
    };
}

// Doctor registration
const doctorForm = document.getElementById('doctorForm');
if (doctorForm) {
    doctorForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(doctorForm));
        const res = await fetch('http://localhost:3001/doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        document.getElementById('doctorResult').textContent = data.message || data.error;
    };
}

// Appointment scheduling
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(appointmentForm));
        // Convert patient_id and doctor_id to numbers
        // formData.patient_id = Number(formData.patient_id);
        // formData.doctor_id = Number(formData.doctor_id);
        const res = await fetch('http://localhost:3001/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        document.getElementById('appointmentResult').textContent = data.message || data.error;
    };
}

// Diagnosis recording
const diagnosisForm = document.getElementById('diagnosisForm');
if (diagnosisForm) {
    diagnosisForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(diagnosisForm));
        formData.appointment_id = Number(formData.appointment_id);
        const res = await fetch('http://localhost:3001/diagnoses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        document.getElementById('diagnosisResult').textContent = data.message || data.error;
    };
}
