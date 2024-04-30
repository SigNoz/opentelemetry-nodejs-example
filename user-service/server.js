import express, { json } from 'express';
import mongoose from 'mongoose';
const { connect, connection, Schema, model } = mongoose;

const app = express();
const port = 3004;

const dbUrl = 'mongodb://mongodb:27017/users';
connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const UserSchema = new Schema({
  name: String,
  email: String,
  registeredAt: { type: Date, default: Date.now }
});
const User = model('User', UserSchema);

app.use(json());

app.get("/", async (req, res) => {
    res.json({"Status": `User Service running on http://localhost:${port}`})
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', details: error.message });
    }
  });
  

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});


app.post('/users', async (req, res) => {
  console.log("users post request body", req.body);  // Log the incoming user data
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`User Service running on http://localhost:${port}`);
});
