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
router.use(authRequired);
router.get('/tasks', getTasks);
router.get('/task/:id', getTask);
router.post('/task', createTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', deleteTask);

export default router;
