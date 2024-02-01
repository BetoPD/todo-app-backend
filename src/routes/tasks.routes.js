import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
  getTask,
  getTasks,
  updateTask,
  deleteTask,
  createTask,
} from '../controllers/tasks.controllers.js';
import { createUpdateTaskSchema } from '../schemas/task.schema.js';

const router = Router();
// For every task route the user needs to be logged in
router.use(authRequired);

// routes for the tasks
router.get('/tasks', getTasks);
router.get('/task/:id', getTask);
router.post('/task', validateSchema(createUpdateTaskSchema), createTask);
router.put('/task/:id', validateSchema(createUpdateTaskSchema), updateTask);
router.delete('/task/:id', deleteTask);

export default router;
