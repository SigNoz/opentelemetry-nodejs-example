import express, { json } from 'express';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
const { connect, Schema, model } = mongoose;

const app = express();
const port = 3001;

const dbUrl = 'mongodb://mongodb:27017/orders';
connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{ productId: Schema.Types.ObjectId, quantity: Number }],
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'awaiting payment', enum: ['awaiting payment', 'paid', 'cancelled', 'shipped', 'completed'] }
});
  
const Order = model('Order', OrderSchema);

app.use(json());

app.get("/", async (req, res) => {
    res.json({"Status": `Order Service running on http://localhost:${port}`})
});

app.get('/orders', async (req, res) => {
    const orders = await Order.find();
    const ordersWithUserDetails = await Promise.all(orders.map(async order => {
      const userResponse = await fetch(`http://user:3004/users/${order.userId}`);
      const user = await userResponse.json();
      return {...order.toObject(), user};
    }));
    res.json(ordersWithUserDetails);
  });

app.post('/orders', async (req, res) => {
    try {
        const order = new Order(req.body);

        // Check product availability and prepare update operations via API calls
        for (const item of order.products) {
            const productResponse = await fetch(`http://product:3003/products/${item.productId}`);
            const product = await productResponse.json();

            if (!product || product.stock < item.quantity) {
                throw new Error(`Product ${item.productId} is out of stock or does not exist.`);
            }

            // Make an API call to decrement stock
            const updateResponse = await fetch(`http://product:3003/products/${item.productId}/decrement-stock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decrementBy: item.quantity })
            });
            if (!updateResponse.ok) {
                throw new Error(`Failed to update stock for Product ${item.productId}.`);
            }
        }

        // Save the order
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET order by ID
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Fetch user details from the User service
        const userResponse = await fetch(`http://user:3004/users/${order.userId}`);
        if (!userResponse.ok) {
            throw new Error(`Failed to fetch user with ID ${order.userId}`);
        }
        const user = await userResponse.json();

        // Combine order and user data
        const detailedOrder = {
            ...order.toObject(),
            user: user
        };

        res.json(detailedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});



app.patch('/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Order Service running on http://localhost:${port}`);
});
