import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { dataRetrieval } from './services/DataRetrievalService.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/',(req,res)=>{
    res.send('API is running')
})


await dataRetrieval('who is Saaransh')