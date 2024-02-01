import pool from '../db.js';

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await pool.query(
      'SELECT * FROM Tasks WHERE Tasks.userId = ?',
      req.user.id
    );
    res.json(tasks[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await pool.query(
      'SELECT * FROM Tasks WHERE Tasks.id = ? AND Tasks.userId = ?',
      [id, req.user.id]
    );

    if (!task[0][0]) throw new Error('No task founded');

    res.json(task[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTask = async (req, res, next) => {
  const userId = req.user.id;
  const { text, dueDate, postDate } = req.body;
  try {
    const newTask = await pool.query(
      'INSERT INTO Tasks (userId, text, dueDate, postDate) VALUES (?, ?, ?, ?)',
      [userId, text, dueDate, postDate]
    );

    res.json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { text, postDate } = req.body;

  try {
    const updatedTask = await pool.query(
      `UPDATE Tasks 
      SET Tasks.text = ?, Tasks.postDate = ? 
      WHERE 
        Tasks.id = ? AND Tasks.userId = ?`,
      [text, postDate, id, req.user.id]
    );

    if (updatedTask[0].affectedRows === 0) throw new Error('No matching task');

    res.json(updatedTask[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedTask = await pool.query(
      `DELETE FROM Tasks
        WHERE 
            Tasks.id = ? AND Tasks.userId = ?`,
      [id, req.user.id]
    );
    if (deletedTask[0].affectedRows === 0) throw new Error('Not matching task');

    res.json(deletedTask[0]);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
};
