import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
  getTask,
  getTasks,
  updateTask,
  deleteTask,
  createTask,
} from '../controllers/tasks.controllers.js';

const router = Router();
// For every task route the user needs to be logged in
router.use(authRequired);

// routes for the tasks
router.get('/tasks', getTasks);
router.get('/task/:id', getTask);
router.post('/task', createTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', deleteTask);

export default router;
