const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const { configCors } = require('./configs/cors');
const authRoute = require('./routers/authRoute');
const db = require('./configs/database');
const app = express();

// app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(configCors);
app.use('/auth', authRoute);

app.get('/', (req, res) => {
  res.send('server is running!');
});

const port = process.env.PORT || 3001;
db.getConnection()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
