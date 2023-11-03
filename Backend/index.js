import express from "express"
import cors from "cors"
import "./config/dotenv.js"
import "express-async-errors"
import shortUrl from './routes/shortUrl.js'
import { createProxyMiddleware } from "http-proxy-middleware"


const PORT = process.env.PORT || 3030;
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus:200,
    credentials: 'include'
}))

app.use(express.json())
app.use('/shorturl', shortUrl)

app.use((req, res, next) => {   res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');  
 next(); });
 

app.listen(PORT, ()=> {
    console.log(`Server is runnig on port ${PORT}`)
})