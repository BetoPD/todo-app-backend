import app from './app.js';
import { PORT } from './config.js';

const port = PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
