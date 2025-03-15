const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./database"); // Import SQLite database

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// ✅ API Health Check Route
app.get("/", (req, res) => {
    res.send("✅ API is running...");
});

// ✅ Route to Get All Users
app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ✅ Route to Get All Prescriptions
app.get("/prescriptions", (req, res) => {
    db.all("SELECT * FROM prescriptions", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ✅ Route to Add a New Prescription
app.post("/prescriptions", (req, res) => {
    const { doctor_id, patient_id, medication, dosage } = req.body;
    if (!doctor_id || !patient_id || !medication || !dosage) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.run(
        `INSERT INTO prescriptions (doctor_id, patient_id, medication, dosage, status) 
        VALUES (?, ?, ?, ?, 'issued')`,
        [doctor_id, patient_id, medication, dosage],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: "✅ Prescription added successfully" });
        }
    );
});

// ✅ Route to Update Prescription Status
app.put("/prescriptions/:id", (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }
    db.run(
        `UPDATE prescriptions SET status = ? WHERE id = ?`,
        [status, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "✅ Prescription updated successfully" });
        }
    );
});

// ✅ Route to Delete a Prescription
app.delete("/prescriptions/:id", (req, res) => {
    const { id } = req.params;
    db.run(
        `DELETE FROM prescriptions WHERE id = ?`,
        [id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "✅ Prescription deleted successfully" });
        }
    );
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
