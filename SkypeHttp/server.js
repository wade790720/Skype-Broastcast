var app = require('express')();
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./skype.key', 'utf8');
var certificate = fs.readFileSync('./skype.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 80;
var SSLPORT = 443;

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

// Welcome
app.get(/^\/*/, function(req, res) {
  var root = "./www";
  var encoder = "utf8";
  if(req.host.match(/skype|localhost/)){
    root+= "/skypeStatic";
  }else{
    
  }
  
  var oUrl = req.originalUrl.replace(/\?.*/,"");
  // console.log(oUrl);
  oUrl = oUrl.replace(/\/[\d]\.[\d]{2}\.[\d]{2}/g,"/1.77.18");
  oUrl = oUrl.replace(/\/[\d]\.[\d]\.[\d]{3}/g,"/0.0.300");
  console.log(oUrl);
  var reqfilePath = root+oUrl;
  
  if(oUrl.match(/\.m4a$/)){
    reqfilePath = root+"/call-answer.m4a";
    res.setHeader("Content-Type","audio/mpeg");
  }else if(oUrl.match(/\.ogg$/)){
    reqfilePath = root+"/call-answer.ogg";
    res.setHeader("Content-Type","audio/mpeg");
  }else if(oUrl.match(/fullExperience\.min\.js$/)){
    reqfilePath = root+"/fullExperience.min.js";
    res.setHeader("Content-Type","application/javascript");
  }else if(oUrl.match(/\.svg$/)){
    // encoder = 'binary';
    res.setHeader("Content-Type","image/svg+xml");
    
  }else if(oUrl.match(/\.(ttf|woff|woff2)$/i)){
    var ext = oUrl.replace(/[\w\W]+\.(ttf|woff|woff2|eot)$/i,"$1");
    // console.log("EXT = " + ext);
    // encoder = 'binary';
    encoder = 'hex';
    var mime = "application/font-"+ext;
    switch(ext){
      case "woff":mime="application/font-woff";break;
      case "woff2":mime="application/font-woff2";break;
      case "ttf":mime="application/font-sfnt";break;
      case "eot":mime="application/vnd.ms-fontobject";break;
    }
    // res.setHeader("Content-Type","application/font-"+ext);
    res.setHeader("Content-Type",mime);
    res.setHeader("Accept-Ranges","bytes");
    // res.setHeader("Accept","*/*");
    
  }else{
    res.setHeader("Content-Type","text/css");
  }
  
  try{
    var reqfile = fs.readFileSync(reqfilePath, encoder);
  }catch(e){
    console.log(e);
  }
  
  console.log("===================================================");
  
  if(reqfile){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Cache-Control","no-cache, no-store, must-revalidate");
    res.setHeader("Content-Length",Buffer.byteLength(reqfile, encoder));
    res.setHeader("Pragma","no-cache");
    res.setHeader("Expires","0");
    res.status(200).send(reqfile);
  }else{
    res.status(404).send("Not Found.");
  }
  
});