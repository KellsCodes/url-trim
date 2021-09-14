const express = require('express');
const Url = require('../model/urlShortner');

const router = express.Router();

router.post('/add-url', async (req, res) => {
    const { inputUrl } = req.body;

    const buildUrl = async (url, inputUrl) => {
        // console.log(inputUrl)
        let requestUrl = url;
        let requestUrlSave = inputUrl;
        if(requestUrl[requestUrl.length - 1] === '.'){ //checks if the url has an input error and ends with period(s)
            requestUrl = requestUrl.split('.').filter(item => item !== "").join('.'); // filters the periods out and returns the correct url
            requestUrlSave = requestUrlSave.split('.').filter(item => item !== "").join('.'); // filters the periods out and returns the correct url
        }
        // const regExUrl = /^[a-z0-9]{2,}.(?=[a-z0-9]{1,})/  //has beginning of two or more characters and ends in two or more characters
        let shortUrl = "";
        const alphaNum = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let keepNoCount = 0;  //count one number in the url
        for(let i = 7; i > 0; --i){
            const randomGen = Math.floor(Math.random() * alphaNum.length);
            if(typeof alphaNum[randomGen] === 'number'){
                if(keepNoCount < 3){
                    shortUrl += alphaNum[randomGen];
                    keepNoCount += 1;
                } else {
                    const newRandomNum = Math.floor((Math.random() * 11) / 4);
                    shortUrl += alphaNum[newRandomNum];
                }
            }else {
                shortUrl += alphaNum[randomGen]
            };
        }
        requestUrl = "";
        // let newUrl = {shortUrl: `https://url-trim.herokuapp.com/${shortUrl}`, mainUrl: requestUrlSave};
        let newUrl = {shortUrl: `http://localhost:3100/${shortUrl}`, mainUrl: requestUrlSave};
        
        const uri = new Url(newUrl);
        //  uri.save().then(result => console.log(result)).catch(error => console.log(error));
        try {
            await uri.save();
            res.status(201).json({mainUrl: uri.mainUrl, shortUrl: uri.shortUrl });

        } catch(error) {
            res.status(409).json({message: error.message});
        }

    }

    let url = inputUrl;
    const regTestStartUrl = /^ht{2}p:\/\/|^ht{2}ps:\/\//;
    const regTestStartUrl2 = /^w{3}./;
    const regTestStartUrl3 = /https:\/\/url-trim.herokuapp.com\/[a-z0-9]{4,7}/;
    // const regTestStartUrl3 = /http:\/\/localhost:3100\/[a-z0-9]{4,7}/;
    if(regTestStartUrl3.test(url)){
        res.json({message: 'Already a u-trim url, Try again!'})
    } else if(regTestStartUrl.test(url)){
        url = url.split(regTestStartUrl).join('');
        buildUrl(url,inputUrl);
    } else if(regTestStartUrl2.test(url)) {
        url = url.split(regTestStartUrl2).join('');
        buildUrl(url,`http://${inputUrl}`);
    }
    else {
        console.log('not a valid url');
        res.json({message: 'not a valid url! Please check your url'});
    }
});


// request url redirection route
router.get('/:url', async (req, res) => {
    const params = req.params.url;
    // console.log(params);
    try {
        // const dataBaseUrl = await Url.findOne({shortUrl: `https://url-trim.herokuapp.com/${params}`});
        const dataBaseUrl = await Url.findOne({shortUrl: `http://localhost:3100/${params}`});
        // console.log(waiting);
        res.status(302).redirect(dataBaseUrl.mainUrl);
    } catch (error) {
        res.status(404).send("Oops! Something went wrong, the u-trim url seems incorrect");
    }
})

module.exports = router