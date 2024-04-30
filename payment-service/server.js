import express, { json } from 'express';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
const { connect, Schema, model } = mongoose;

const app = express();
const port = 3002;

const dbUrl = 'mongodb://mongodb:27017/payments';
connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const PaymentSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    amount: Number,
    paymentDate: { type: Date, default: Date.now }
});

const Payment = model('Payment', PaymentSchema);

app.use(json());

app.get("/", async (req, res) => {
    res.json({"Status": `Payment Service running on http://localhost:${port}`})
});

app.get('/payments', async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

app.post('/payments', async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        // Fetch the order to check its status and validity
        const order = await fetch(`http://order:3001/orders/${orderId}`).then(res => res.json());
        console.log(order);
        if (!order || order.status !== 'awaiting payment') {
            return res.status(400).json({ error: 'Invalid order ID or order not ready for payment' });
        }

        const newPayment = new Payment({ orderId, amount });
        await newPayment.save();

        // Optionally, update the order status to 'paid'
        await fetch(`http://order:3001/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'paid' })
        });

        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Payment Service running on http://localhost:${port}`);
});
