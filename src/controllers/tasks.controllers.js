import pool from '../db.js';

export const getTasks = async (req, res, next) => {
  try {
    // Selects the tasks from the database
    const tasks = await pool.query(
      'SELECT * FROM Tasks WHERE Tasks.userId = ?',
      req.user.id
    );

    // Sends the selected tasks from the database
    res.json(tasks[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getTask = async (req, res, next) => {
  try {
    // Id of the task to retrieve
    const { id } = req.params;
    // Query to select the specific task
    const task = await pool.query(
      'SELECT * FROM Tasks WHERE Tasks.id = ? AND Tasks.userId = ?',
      [id, req.user.id]
    );
    // checks if the task exists
    if (!task[0][0]) return res.status(404).json({ message: 'Task not found' });
    // if it exists it sends it
    res.json(task[0][0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTask = async (req, res, next) => {
  try {
    // Data send in the body of the request
    const { title, text, dueDate, postDate } = req.body;
    // Creates a task
    const newTask = await pool.query(
      'INSERT INTO Tasks (userId, title, text, dueDate, postDate) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, text, dueDate, postDate]
    );
    // Sends the created task
    res.json({ id: newTask[0].insertId, title, text, dueDate, postDate });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res, next) => {
  try {
    // Id of the task to be udpated
    const { id } = req.params;
    //   Things that can be udpated
    const { title, text, postDate, dueDate } = req.body;
    // Query to update the task
    const updatedTask = await pool.query(
      `UPDATE Tasks 
      SET 
        Tasks.title = ?, Tasks.text = ?, Tasks.postDate = ?, dueDate = ?
      WHERE 
        Tasks.id = ? AND Tasks.userId = ?`,
      [title, text, postDate, dueDate, id, req.user.id]
    );
    // Checks if there was a matching task
    if (updatedTask[0].affectedRows === 0)
      return res.status(404).json({ message: 'Task not found' });
    // sends the updated task
    res.json({ id, title, text, postDate });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    // id of the task to be deleted
    const { id } = req.params;
    // query to delete the task
    const deletedTask = await pool.query(
      `DELETE FROM Tasks
        WHERE 
            Tasks.id = ? AND Tasks.userId = ?`,
      [id, req.user.id]
    );
    // checks if there was a matching task
    if (deletedTask[0].affectedRows === 0)
      return res.status(404).json({ message: 'Task not found' });
    // Sends the deleted task
    res.json({ id: id });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
};
