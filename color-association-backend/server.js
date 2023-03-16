const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors());

// Middleware to parse request body
app.use(express.json());

const uri = 'mongodb+srv://s00238682:wcAcjNfrqPp6vP2d@cluster0.8ijrt6g.mongodb.net/color-association_db?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI

let db;

(async () => {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    db = client.db('color_association_db');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

app.post('/api/color-association', async (req, res) => {
  const colorAssociation = req.body;

  // Validate the data (add more validation if needed)
  if (!colorAssociation || !colorAssociation.color || !colorAssociation.sound) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Save the color association in MongoDB
    await db.collection('color_associations').insertOne(colorAssociation);
    res.status(201).json({ message: 'Color association saved' });
  } catch (error) {
    console.error('Error saving color association:', error);
    res.status(500).json({ message: 'Error saving color association' });
  }
});

app.get('/api/color-associations', async (req, res) => {
  try {
    const colorAssociations = await db.collection('color_associations').find().toArray();
    res.json(colorAssociations);
  } catch (error) {
    console.error('Error fetching color associations:', error);
    res.status(500).json({ message: 'Error fetching color associations' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
