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
  // Id of the task to retrieve
  const { id } = req.params;
  try {
    // Query to select the specific task
    const task = await pool.query(
      'SELECT * FROM Tasks WHERE Tasks.id = ? AND Tasks.userId = ?',
      [id, req.user.id]
    );
    // checks if the task exists
    if (!task[0][0]) throw new Error('No task founded');
    // if it exists it sends it
    res.json(task[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTask = async (req, res, next) => {
  // Data send in the body of the request
  const { text, dueDate, postDate } = req.body;
  try {
    // Creates a task
    const newTask = await pool.query(
      'INSERT INTO Tasks (userId, text, dueDate, postDate) VALUES (?, ?, ?, ?)',
      [req.user.id, text, dueDate, postDate]
    );
    // Sends the created task
    res.json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res, next) => {
  // Id of the task to be udpated
  const { id } = req.params;
  //   Things that can be udpated
  const { text, postDate } = req.body;

  try {
    // Query to update the task
    const updatedTask = await pool.query(
      `UPDATE Tasks 
      SET Tasks.text = ?, Tasks.postDate = ? 
      WHERE 
        Tasks.id = ? AND Tasks.userId = ?`,
      [text, postDate, id, req.user.id]
    );
    // Checks if there was a matching task
    if (updatedTask[0].affectedRows === 0) throw new Error('No matching task');
    // sends the updated task
    res.json(updatedTask[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res, next) => {
  // id of the task to be deleted
  const { id } = req.params;

  try {
    // query to delete the task
    const deletedTask = await pool.query(
      `DELETE FROM Tasks
        WHERE 
            Tasks.id = ? AND Tasks.userId = ?`,
      [id, req.user.id]
    );
    // checks if there was a matching task
    if (deletedTask[0].affectedRows === 0) throw new Error('Not matching task');
    // Sends the deleted task
    res.json(deletedTask[0]);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error: error.message });
  }
};
