import express from "express";
import db from "../config/database.js"
import { ObjectId } from "mongodb";
import shortid from "shortid";

const router = express.Router();
let collection = await db.collection("url");
const urlFormatRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

router.get('/', async (req, res) => {
    let results = await collection.find().toArray()
    res.send(results).status(200)
})

router.post('/', async(req, res) => {
    const {longUrl} = req.body;
    const numOfClick  = 0 
    const existingDocument = await collection.findOne({ longUrl: longUrl });

    if (!longUrl) {
        return res.status(400).json({ error: 'This fields must be provided and not null' });
    } else if(typeof longUrl !== 'string' || !urlFormatRegex.test(longUrl)){
        return res.status(400).json({ error: 'Invalid URL format.' });
    } else if(existingDocument){
        return res.status(400).json({ error: 'This URL already exists' });
    }
    
    const shortUrl = shortid.generate(3)
    await collection.insertOne({ longUrl, shortUrl, numOfClick,})
    const findByLongUrl = await collection.find({ longUrl : longUrl }).toArray()

    res.send(findByLongUrl).status(200)
})

router.get('/:shortUrl', async(req, res) => {
    const { shortUrl } = req.params;
    await collection.updateOne({ shortUrl }, {$inc : { numOfClick : 1 }})
    let checkNumOfClick = await collection.find({ shortUrl : shortUrl}).toArray()

    res.send(checkNumOfClick).status(200)
})

router.delete('/:shortUrl', async(req, res) => {
    const { shortUrl } = req.params;
    await collection.deleteOne({shortUrl})
    const existingDocument = await collection.findOne({ shortUrl: shortUrl });
    if(!existingDocument){
        res.status(400).json({ error : 'This URL does not exist'})
    }

    res.status(200).json({ message : 'This URL has been Deleted'})
})
export default router;