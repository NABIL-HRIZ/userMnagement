import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/auth.js';


const router = express.Router();

router.post('/register', async (req, res) => {
  const {name, email, password,role } = req.body;

  try {
    const connection = await connectToDatabase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password,role) VALUES (?, ?, ?,?)",
      [name, email, hashedPassword,role]
    );
      console.log('user added')

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await connectToDatabase();

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name , role: user.role }, 
      process.env.JWT_SECRET || "secretkey",  
      { expiresIn: "1h" }  
    );

    res.json({ message: "Login successful", token,role:user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/usersHome", verifyToken, (req, res) => {
  res.json({ message: `${req.user.name}` });
});

router.get("/Dashboard", verifyToken, (req, res) => {
  res.json({ message: `${req.user.name}` });
});

router.get('/dashboard/stats', verifyToken, async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    const [userRows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const totalUsers = userRows[0].count;
    
   
    const [adminRows] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
    const totalAdmins = adminRows[0].count;
    
    
    
    res.json({ totalUsers, totalAdmins});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get('/dashboard/users', verifyToken, async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT id, name, email, role FROM users '
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete('/dashboard/users/:id', verifyToken, async (req, res) => {
  try {
    const connection = await connectToDatabase();
    await connection.execute(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
export default router;
