const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Todo = require('./models/todo');
require('dotenv').config();


const app = express();
const port =  3001; 

app.use(cors());

//mongodb connect
const uri = process.env.MONGODB_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to the Mongodb...")
}).catch((err) => {
    console.log(err);
    process.exit(1); // Exit process if database connection fails
});

// Middleware
app.use(express.json());

// Routes
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/todos', async (req, res) => {
    const { todo } = req.body;

    try {
        const newTodo = new Todo({
            todo,
        });

        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

