const db = require("./database"); // Import SQLite database

(async () => {
    try {
        // Insert sample users
        await db.run(
            `INSERT INTO users (name, email, password, role) VALUES 
            ('Dr. John Doe', 'doctor1@example.com', 'hashedpassword123', 'doctor'),
            ('Jane Smith', 'patient1@example.com', 'hashedpassword456', 'patient'),
            ('Pharmacy A', 'pharmacy1@example.com', 'hashedpassword789', 'pharmacy')`
        );
        console.log("✅ Users inserted successfully.");

        // Insert sample prescriptions
        await db.run(
            `INSERT INTO prescriptions (doctor_id, patient_id, medication, dosage, status) VALUES 
            (1, 2, 'Ibuprofen', '200mg twice daily', 'issued'),
            (1, 2, 'Paracetamol', '500mg as needed', 'issued')`
        );
        console.log("✅ Prescriptions inserted successfully.");
        
        await db.close(); // Close the database connection
        console.log("✅ Database connection closed.");
    } catch (error) {
        console.error("❌ Error seeding database:", error.message);
    }
})();
