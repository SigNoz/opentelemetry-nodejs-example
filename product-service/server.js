import express, { json } from 'express';
import mongoose from 'mongoose';
const { connect, connection, Schema, model } = mongoose;

const app = express();
const port = 3003;

const dbUrl = 'mongodb://mongodb:27017/products';
connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const ProductSchema = new Schema({
  name: String,
  price: Number,
  stock: Number
});
const Product = model('Product', ProductSchema);

app.use(json());

app.get("/", async (req, res) => {
    res.json({"Status": `Product Service running on http://localhost:${port}`})
});

app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
});

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
});

app.post('/products/:id/decrement-stock', async (req, res) => {
    const { decrementBy } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < decrementBy) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        product.stock -= decrementBy;
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
});

app.listen(port, () => {
  console.log(`Product Service running on http://localhost:${port}`);
});
