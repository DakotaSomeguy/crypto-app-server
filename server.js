const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/cryptoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// MongoDB Schema
const tokenSchema = new mongoose.Schema({
  index: String,
  ticker: String,
  sharesTraded: String,
  priceTraded: String,
  changeDirectionUp: Boolean,
  change: String,
});

const Token = mongoose.model('Token', tokenSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/api/my-tokens', async (req, res) => {
  try {
    const tokens = await Token.find();
    res.json(tokens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/my-tokens', async (req, res) => {
    try {
      const { ticker } = req.body;
  
      // Check if a token with the same ticker already exists
      const existingToken = await Token.findOne({ ticker });
  
      if (existingToken) {
        // Token already exists, return a response indicating the duplicate
        return res.status(409).json({ error: 'Token already exists' });
      }
  
      // Token does not exist, add it to the database
      const newToken = await Token.create(req.body);
      res.json(newToken);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Route for deleting a token
app.delete('/api/my-tokens/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Use findByIdAndDelete to find and delete the token by its ID
      const deletedToken = await Token.findByIdAndDelete(id);
  
      if (!deletedToken) {
        // Token not found, return a response indicating the absence
        return res.status(404).json({ error: 'Token not found' });
      }
  
      res.json({ message: 'Token deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
