const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// Question 1: serve the front-end (public/index.html) at the main URL
app.use(express.static(path.join(__dirname, 'public')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/companyDB';
const PORT = process.env.PORT || 3000;

// Question 2: Employee schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  salary: { type: Number, required: true },
  email: { type: String, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// Seed sample data (only if collection is empty)
async function seedData() {
  if ((await Employee.countDocuments()) === 0) {
    await Employee.insertMany([
      { employeeId: 101, name: 'Arun Kumar', department: 'IT', designation: 'Developer', salary: 50000, email: 'arun@example.com' },
      { employeeId: 102, name: 'Priya Sharma', department: 'HR', designation: 'Manager', salary: 60000, email: 'priya@example.com' },
      { employeeId: 103, name: 'Rahul Verma', department: 'Finance', designation: 'Accountant', salary: 45000, email: 'rahul@example.com' }
    ]);
    console.log('Sample employees inserted');
  }
}

// List all employees
app.get('/employees', async (req, res) => {
  try {
    res.json(await Employee.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. SEARCH an employee using employeeId
app.get('/employee/:employeeId', async (req, res) => {
  try {
    const emp = await Employee.findOne({ employeeId: Number(req.params.employeeId) });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. UPDATE the salary of an employee using employeeId
app.put('/employee/:employeeId', async (req, res) => {
  try {
    const { salary } = req.body;
    if (typeof salary !== 'number' || salary < 0) {
      return res.status(400).json({ message: 'Provide a valid numeric salary' });
    }
    const emp = await Employee.findOneAndUpdate(
      { employeeId: Number(req.params.employeeId) },
      { salary },
      { new: true }
    );
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Salary updated successfully', employee: emp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Start server (the form works even if MongoDB is slow to connect)
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
