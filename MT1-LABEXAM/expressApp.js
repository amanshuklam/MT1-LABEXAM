import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

let cart = [
    {
        id: 1,
        productName: "Wireless Mouse",
        price: 799,
        quantity: 2,
        category: "Electronics"
    },
    {
        id: 2,
        productName: "Mechanical Keyboard",
        price: 2499,
        quantity: 1,
        category: "Electronics"
    },
    {
        id: 3,
        productName: "USB-C Cable",
        price: 399,
        quantity: 3,
        category: "Accessories"
    }
];

const formatItem = (item) => ({
    ...item,
    totalPrice: item.price * item.quantity
});

app.get('/cart', (req, res) => {
    const formattedCart = cart.map(formatItem);
    res.status(200).json(formattedCart);
});

app.get('/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = cart.find(prod => prod.id === id);

    if (!item) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(formatItem(item));
});

app.post('/cart', (req, res) => {
    const { id, productName, price, quantity, category } = req.body;

    if (!id || !productName || price === undefined || quantity === undefined) {
        return res.status(400).json({ message: "Invalid payload. Required: id, productName, price, quantity" });
    }

    const existingProduct = cart.find(prod => prod.id === id);
    if (existingProduct) {
        return res.status(400).json({ message: "Product with this ID already exists" });
    }

    const newProduct = { id, productName, price, quantity, category: category || "General" };
    cart.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: formatItem(newProduct)
    });
});

app.put('/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cart.findIndex(prod => prod.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { productName, price, quantity, category } = req.body;

    if (productName) cart[index].productName = productName;
    if (price !== undefined) cart[index].price = price;
    if (quantity !== undefined) cart[index].quantity = quantity;
    if (category) cart[index].category = category;

    res.status(200).json({
        message: "Product updated successfully",
        product: formatItem(cart[index])
    });
});

app.delete('/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cart.findIndex(prod => prod.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const deletedItem = cart.splice(index, 1);

    res.status(200).json({
        message: "Product removed successfully",
        product: formatItem(deletedItem[0])
    });
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});