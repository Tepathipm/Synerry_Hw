import express from "express"
import cors from "cors"
import "./config/dotenv.js"
import "express-async-errors"
import shortUrl from './routes/shortUrl.js'


const PORT = process.env.PORT || 3030;
const app = express()

app.use(cors())
app.use(express.json())
app.use('/shorturl', shortUrl)

app.listen(PORT, ()=> {
    console.log(`Server is runnig on port ${PORT}`)
})