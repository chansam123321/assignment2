var restify = require("restify");
var firebase = require("firebase")
var server = restify.createServer();


server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

//config for firebase
  var config = {
    apiKey: "AIzaSyCH_EASP-1L1lZvSgr7Pdhp7V3WjjXo1iQ",
    authDomain: "bamboo-position-150706.firebaseapp.com",
    databaseURL: "https://bamboo-position-150706.firebaseio.com",
    projectId: "bamboo-position-150706",
    storageBucket: "bamboo-position-150706.appspot.com",
    messagingSenderId: "824984647747"
  };
  firebase.initializeApp(config);
var database = firebase.database();

//Shows server prot and IP address
server.listen(8080, function(err) {
    //console.log(process.env.PORT, process.env.IP);
    console.log("Your Server Port is :" + process.env.PORT);
    console.log("Your IP  is :" + process.env.IP);
    console.log("Connect Successfully");
});

//Get Comic Funtion
server.get('/ShowComic', function(req, res, next){
    var comicId = req.query.comicId;
    var result = new Promise(function(collectedMessage, reject){
        var comicRefStringResult = "Comic/";
        if (comicId != null){
            comicRefStringResult += comicId;
        }
        
    var comicRef = database.ref(comicRefStringResult);
    comicRef.once('value').then(function(getData){
        var json = getData.val();
        var size = getData.numChildren();
        
        if (json != null){
            if (comicId != null){
                size = 1;
            }
            
            collectedMessage({
               
                Comiclist: json
                
            });
        }
        else {
            collectedMessage({
                Message: "fail"
            });
        }
    });
        
});
    
    result.then(function(value){
        res.send(value);
        res.end();
    });
});
