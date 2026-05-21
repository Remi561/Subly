import express from 'express';
import 'dotenv/config'
import { authRouter } from './src/routes/auth.route.js';

const PORT = process.env.PORT || 3001;
const app = express()

app.use(express.json())


// apis

app.use('/api/auth', authRouter)


// Starting the server 

app.listen(PORT, (error) => {
    if (error) {
        console.log(`Something went wrong ${error}`)
        return
    } 
    console.log(`Server is running on port ${PORT}`);
    
})