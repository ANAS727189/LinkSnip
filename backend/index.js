import express from 'express';
import UrlRoutes from './routes/url.js';
import { connectDB } from './models/db.js';
import Url from './models/url.js';
import cors from 'cors';

const app = express();
const port = 3000;


connectDB();
app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:3001'
    }
));


app.use('/url', UrlRoutes);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    console.log('Requested shortId:', shortId);
  
    const url = await Url.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now()
          }
        }
      },
      { new: true }
    );
  
    console.log('Found URL:', url);
  
    if (!url) {
      console.log('Short URL not found');
      return res.status(404).json({ error: "Short URL not found" });
    }
  
    console.log('Redirecting to:', url.redirectUrl);
    res.redirect(url.redirectUrl);
  });



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})