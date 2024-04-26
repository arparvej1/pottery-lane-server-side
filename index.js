const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.MY_KEY)

app.get('/',  (req, res) => {
  res.send('Server is running...')
});

app.listen(port, ()=>{
  console.log(`Server is running port: ${port}
  Link: http://localhost:${port}`);
});