const express = require('express');
const app = express();
const mongoose = require('mongoose');
const pollRouter = require('./routes/pollRouter');
const userRouter = require('./routes/userRouter');
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose
	.connect(process.env.DB_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
    useFindAndModify: false,
		useCreateIndex: true
	})
	.then(console.log('Connected to DB'))
	.catch(e => console.log(e));

app.use('/polls', pollRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}...`);
});
