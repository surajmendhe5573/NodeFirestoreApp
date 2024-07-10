const express = require('express');
const bodyParser = require('body-parser');
const db = require('./firebase');

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the view engine to EJS and serve static files from 'public' directory
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

// Handle form submission 
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.error('Validation error: All fields are required.');
    return res.status(400).send('All fields are required.');
  }

  try {
    await db.collection('contacts').add({
      name,
      email,
      message,
      timestamp: new Date()
    });
    console.log('Document successfully written!');
    res.send('Form submitted successfully.');
  } catch (error) {
    console.error('Error writing document: ', error);
    res.status(500).send('Error submitting form.');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
