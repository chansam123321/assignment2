var restify = require("restify");
var firebase = require("firebase")
var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

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

server.listen(8080, function(err) {
    console.log(process.env.PORT, process.env.IP);
    console.log("App is ready at :" + "8080");
});

server.get('/listComic', function(req, res, next){
    var moviesid = req.query.moviesid;
    var result = new Promise(function(resolve, reject){
        var moviesRefStr = "Comic/";
        if (moviesid != null){
            moviesRefStr += moviesid;
        }
        
    var moviesRef = database.ref(moviesRefStr);
    moviesRef.once('value').then(function(sn){
        var json = sn.val();
        var size = sn.numChildren();
        
        if (json != null){
            if (moviesid != null){
                size = 1;
            }
            
            resolve({
                success: true,
                list: json,
                size: size
            });
        }
        else {
            resolve({
                success: false,
                message: "fail"
            });
        }
    });
        
});
    
    result.then(function(value){
        res.send(value);
        res.end();
    });
});

server.post('/addComic', function(req, res, next){
    var result = new Promise(function(resolve, reject){
        if (req.headers['content-type'] != 'application/json'){
            resolve({
                success: false,
                message : "fail"
            });
        }else{
            var json = req.body;
            var id = req.query.moviesid;
            var moviesRefStr = "Comic/"+id;
            
            firebase.database().ref(moviesRefStr).set(json);
            resolve({
                success:true,
                moviesId: id
            });
        }
    });
    
    result.then(function(value){
        res.send(value);
        res.end();
    });
});


server.patch("/updataComic", function(req, res, next){
    var result = new Promise (function(resolve, reject){
        if (req.headers['content-type'] == 'application/json'){
            var moviesid = req.query.moviesid;
            var json = req.body;
            if (moviesid != null && json !=null){
                var moviesRefStr = "Comic/" + moviesid;
                firebase.database().ref(moviesRefStr).update(json);
                resolve({
                    success: true,
                    id : moviesid,
                    update:json
                });
            }else{
                resolve({
                    success: false
                });
            }
        }
        else{
            resolve({
                success:false
            });
        }
    });
});

server.del('deleteComic', function(req, res, next){
    var result = new Promise(function (resolve, reject){
        var moviesid = req.query.moviesid;
        if (moviesid != null){
            var moviesRefStr = "Comic/" + moviesid;
            firebase.database().ref(moviesRefStr).remove();
            resolve({
                success: true,
                id : moviesid
            });
        }else{
            resolve({
                success : false,
                message : "fail"
            });
        }
    });
    
    result.then(function(value){
        res.send(value);
        res.end();
    });
});
