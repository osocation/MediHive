const sqlite3 = require("sqlite3").verbose();

// Create or connect to SQLite database
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("❌ Error opening database:", err.message);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

// Ensure tables are created before exporting the database connection
db.serialize(() => {
    // Create Users Table
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('doctor', 'patient', 'pharmacy')) NOT NULL
        )`,
        (err) => {
            if (err) console.error("❌ Error creating users table:", err.message);
            else console.log("✅ Users table created or already exists.");
        }
    );

    // Create Prescriptions Table
    db.run(
        `CREATE TABLE IF NOT EXISTS prescriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_id INTEGER NOT NULL,
            patient_id INTEGER NOT NULL,
            pharmacy_id INTEGER,
            medication TEXT NOT NULL,
            dosage TEXT NOT NULL,
            status TEXT CHECK(status IN ('issued', 'fulfilled', 'expired')) DEFAULT 'issued',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (doctor_id) REFERENCES users(id),
            FOREIGN KEY (patient_id) REFERENCES users(id),
            FOREIGN KEY (pharmacy_id) REFERENCES users(id)
        )`,
        (err) => {
            if (err) console.error("❌ Error creating prescriptions table:", err.message);
            else console.log("✅ Prescriptions table created or already exists.");
        }
    );
});

// Export the database connection
module.exports = db;
