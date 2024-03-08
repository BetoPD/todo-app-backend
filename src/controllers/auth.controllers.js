import bcrypt from 'bcryptjs';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import { createAccessToken } from '../libs/jwt.js';
import { TOKEN_SECRET } from '../config.js';

export const register = async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO Users (email, password, username) VALUES (?, ?, ?)',
      [email, passwordHash, username]
    );
    const token = await createAccessToken({ id: newUser[0].insertId });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    const user = await pool.query(
      'SELECT username, email FROM Users WHERE Users.Id = ?',
      newUser[0].insertId
    );
    res.json(user[0][0]);
  } catch (error) {
    res.status(409).json({ message: error.sqlMessage });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userFound = await pool.query(
      'SELECT * FROM Users WHERE Users.email = ?',
      email
    );

    if (!userFound[0][0])
      return res.status(400).json({ message: 'User does not exists' });

    const isMatch = await bcrypt.compare(password, userFound[0][0].password);

    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect password' });

    const token = await createAccessToken({ id: userFound[0][0].Id });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });
    delete userFound[0][0].password;
    res.json(userFound[0][0]);
  } catch (error) {
    res.status(500).json({ message: error.sqlMessage });
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

export const verify = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = user;
    const userFound = await pool.query(
      'SELECT Id, email, username FROM Users WHERE Users.Id = ?',
      id
    );

    if (!userFound[0][0])
      return res.status(401).json({ message: 'Unauthorized' });

    res.json(userFound[0][0]);
  });
};
