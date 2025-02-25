const { PORT } = require('./utils/config');
const express = require('express');
const app = express();
const { connectDB } = require('./utils/db');
const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const authorRouter = require('./controllers/author');
const { errorMiddleware, tokenExtractor } = require('./utils/middleware');

app.use(express.json());

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorRouter);

app.use(errorMiddleware);

const connect = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
  });
};

connect();
