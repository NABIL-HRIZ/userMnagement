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
      { id: user.id, username: user.name }, 
      process.env.JWT_SECRET || "secretkey",  
      { expiresIn: "1h" }  
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/usersHome", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.name} to your home page!` });
});

export default router;
