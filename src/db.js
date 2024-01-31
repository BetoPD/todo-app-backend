import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'SilverSurfer2603',
  database: 'ToDoApp',
  port: 3306,
});

export default pool;
