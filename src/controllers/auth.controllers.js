import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO Users (email, password, username) VALUES (?, ?, ?)',
      [email, passwordHash, username]
    );

    const token = await createAccessToken({ id: newUser[0].insertId });
    res.cookie('token', token);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userFound = await pool.query(
      'SELECT * FROM Users WHERE Users.email = ?',
      email
    );

    if (!userFound[0][0]) throw new Error('Not found');

    const isMatch = await bcrypt.compare(password, userFound[0][0].password);

    if (!isMatch) throw new Error('Invalid credentials');

    const token = await createAccessToken({ id: userFound[0][0].Id });
    res.cookie('token', token);
    res.json({ message: 'Access' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res, next) => {
  res.cookie('token', '', {
    expires: new Date(0),
  });

  return res.sendStatus(200);
};

export const profile = async (req, res, next) => {
  try {
    const userFound = await pool.query(
      'SELECT * FROM Users WHERE Users.Id = ?',
      req.user.id
    );

    if (!userFound[0][0]) throw new Error('User not exists');

    res.json({
      email: userFound[0][0].email,
      username: userFound[0][0].username,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};
