const { PORT } = require('./utils/config');
const express = require('express');
const app = express();
const { connectDB } = require('./utils/db');
const blogRouter = require('./controllers/blog');
const { errorMiddleware } = require('./utils/middleware');

app.use(express.json());

app.use('/api/blogs', blogRouter);

app.use(errorMiddleware);

const connect = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
  });
};

connect();
