import shortid from "shortid";
import Url from "./../models/url.js"


async function handleUrl(req, res) {
   const shortId = shortid.generate();
   const body = req.body;
   if(!body.url) {
     return res.status(400).json({error: "URL is required"});
   }
   const newUrl = await Url.create({
     shortId, 
     redirectUrl: body.url,
     visitHistory: []
    });

    return res.json({
        newUrl
    });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await Url.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

async function handleGetRecentUrls(req, res) {
    try {
      const recentUrls = await Url.find().sort({ createdAt: -1 }).limit(10);
      res.json(recentUrls);
    } catch (error) {
      console.error('Error fetching recent URLs:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

export {handleUrl, handleGetAnalytics, handleGetRecentUrls};