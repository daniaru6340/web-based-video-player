var http = require('http');
var express = require('express');
var app = express();
const fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let favicon = require('serve-favicon');
const { encode } = require('querystring');
const axios = require('axios');
const { convert } = require('subtitle-converter');
var urlExists = require('url-exists');

const https = require('https');
const httpsAgent = new https.Agent({rejectUnauthorized: false});



var IP = "0.0.0.0";
const PORT = 9000;

app.use(express.json());
app.use(logger('dev'));

app.set('views', path.join(__dirname,'pages'));
app.set('view engine', 'ejs')

//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/favicon.ico'));




app.get('/', async function(req, res) {
    res.render('index')

});

app.post('/play', async function(req, res) {
    
    
    var vidurl = req.body.vidurl;
    var suburl;
suburl = req.body.suburl;
    let subfile;
    const subext = /\.(dfxp|scc|srt|ttml|vtt|ssa|ass)$/i;

    

    urlExists(suburl, async function(err,validurl) {
   
    

    let pageTwo;
    if((suburl === "" || suburl.length === 0 || suburl === "null") && (vidurl === "" || vidurl.length.length === 0)) {

        vidurl = "Subtitle and Video URL has not been provided ";
        subfile = "Please provide video and subtitle in the previous page and try again";
        pageTwo = 'error';

    } else if (vidurl === "" || vidurl.length.length === 0) {

        vidurl = "No video URL has been provided";
        subfile = "Please provide a Video file in the previous page"
        pageTwo = 'error';

    } else if (suburl === "" || suburl.length === 0 || suburl === "null"){

        vidurl = "NO Subtitle URL provided";
        subfile = "Please provide a subtitle in the previous page and try again";
        pageTwo = 'error';


    }else if (validurl == false ) {

        vidurl = "Invalid URL has been provided";
        subfile = "Please provide valid URL  in the previous page"
        pageTwo = 'error';
        
    }else if ( (subext.test(suburl)  || suburl==="localhost:") ) {
        pageTwo = 'play';

        console.log("localhost or valid subtitle file detected");

        suburl = suburl.replace("localhost:","127.0.0.1:");
        const response = await axios.get(suburl);
     subfile = response.data;


     app.get('/play/sub.vtt', async function(req, res){
       
        const subtitleText = subfile;
        const outputExtention = '.vtt';
        const options = {
            removeTextFormatting: true,
        };

        const {subtitle, status} = convert(subtitleText, outputExtention, options);

        if (status.success) console.log("converting successful");
        else console.log("what happened");

        let vtt = subtitle;

       
        res.send(vtt)
        
            
    })

    }  else {
        vidurl = "Something unexpected happened";
        subfile = "If you are the developer please check the console";
        pageTwo = 'error';


    }

        

    

    
   






   
    res.render(pageTwo, { vidurl: vidurl, subfile: subfile});
});
   
});

app.get('/data', function (req, res) {
    var data = {message:'API says hello'};
    res.json(data);
});
app.listen(PORT, function () {
    console.log('Server is running on ' + 'http://' + IP + ':' + PORT);

});
