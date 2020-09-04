const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//connect to mongoose
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true , useUnifiedTopology: true }, ()=> {
    console.log('connected to db');
})

//import Routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

app.use(express.json());

//Routes MiddleWare
app.use('/api/user',authRoute);
app.use('/api/posts',postsRoute);


app.listen(3000,() => console.log("Server Started"))