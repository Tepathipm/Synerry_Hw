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
    const shortId = shortid.generate()
    const shortUrl = `http://localhost:3030/shorturl/${shortId}`
    await collection.insertOne({ longUrl , shortUrl, numOfClick, shortId})
    const findByShortId = await collection.find({ shortId : shortId }).toArray()
    // console.log(findByLongUrl);
    res.json(findByShortId).status(200)
})

// router.get('/:shortUrl', async(req, res) => {
//     const  shortUrl2  = req.params.shortUrl;
//     // await collection.updateOne({ shortId : shortUrl2 }, {$inc : { numOfClick : 1 }})
//     let showLongToRedirect = await collection.findOneAndUpdate({ shortId : shortUrl2 } , {$inc : { numOfClick : 1 }})
//     return res.redirect(showLongToRedirect.longUrl)
//     // res.redirect(showLongToRedirect.longUrl)
//     // res.send(showLongToRedirect.longUrl).status(200)
    
// })

router.get('/:shortUrl', async (req, res) => {
    const shortUrl2 = req.params.shortUrl;
    const showLongToRedirect = await collection.findOneAndUpdate(
      { shortId: shortUrl2 },
      { $inc: { numOfClick: 1 } }
    );
  
    if (showLongToRedirect) {
      res.redirect(301, showLongToRedirect.longUrl);
    } else {
      res.status(404).send('Not Found');
    }
  });
  

router.delete('/:shortUrl', async(req, res) => {
    const  shortUrl2  = req.params.shortUrl;
    const existingDocument = await collection.findOne({ shortId : shortUrl2 });
    if(!existingDocument){
        res.status(400).json({ error : 'This URL does not exist'})
    }else {
        await collection.deleteOne({shortId : shortUrl2})
        res.status(200).json({ message : 'This URL has been Deleted'})
    }
})
export default router;