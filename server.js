const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');
//load env vars
dotenv.config({ path: './config/config.env' });
//connect to database
connectDB();

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments',appointments);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,console.log('Server running in ' , process.env.NODE_ENV,' mode on port' , PORT));

//handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //close server and exit process
    server.close(()=>process.exit(1));
})