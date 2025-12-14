import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { main } from './main.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/',(req,res)=>{
    res.send('API is running')
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

