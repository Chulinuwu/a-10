const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const {xss} = require('express-xss-sanitizer');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
//load env vars
dotenv.config({ path: './config/config.env' });
//connect to database
connectDB();

const app = express();




app.use(express.json());
app.use(cors());
app.use(hpp());
const limiter= rateLimit({
    windowsMs : 10*60*1000 ,//10min
    max:100
});
app.use(limiter);
app.use(mongoSanitize());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info :{
            title :'Library API',
            version :'1.0.0',
            description : 'A simple Express VacQ API'
        }
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

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