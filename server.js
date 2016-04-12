/*Lab 5 - 51202655 - exe4*/
var express = require('express');
var mysql = require('mysql');
var http = require( 'http');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));
var bodyParser  = require('body-parser');
var path = require('path'); 
var S = require('string');
const crypto = require('crypto');

var sessionid = "AAAAAAAAAAAAAAA"; //Khoi tao SessionID cho viec dung sau nay.

/*Config Server*/
var ip = config.ip;
var port = config.port;
/*Config Database*/
var connection = mysql.createConnection({ 
    host: config.ip,
    user: config.user,
    password: config.password,
    database: config.database
});


var server = http.createServer(function(request,response){
    console.log("Request: " + request.url);
    fs.readFile("./" + request.url, function(error,data){
        if(error){
                response.writeHead(404,{"Content-type":"text/plain"})
                response.end("404 - Not Found");
        }else{
             response.writeHead(200,{"Content-type":"text/html"});
             response.end(data);        }
    });

});


//Express
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
    var data = {
        "Data":""
    };
    data["Data"] = "Welcome to Lab5 ....";
    res.json(data);
});


/*-----------------------GET Method-----------------------*/
app.get('/api/users',function(req,res){
    var data = {
        "success":0,
        "Books":""
    };
    
    connection.query("SELECT * from user",function(err, rows, fields){
        if(rows.length != 0){
            data["success"] = 1;
            data["Users"] = rows;
            res.json(data);
        }else{
            data["Users"] = 'No Users Found..';
            res.json(data);
        }
    });
});




/*-----------------------POST Method-----------------------*/
//SIGN UP
app.post('/api/users',function(req,res){
    var Username = req.body.username;
    var Email = req.body.email;
    var Password = req.body.password;
    var Phone = req.body.phone;
    var data = {
        "success":1
    };
    if(!!Username && !!Email && !!Password&& !!Phone){
        connection.query("INSERT INTO user VALUES('',?,?,?,?)",[Username,Email,Password,Phone],function(err, rows, fields){
            if(!!err){
                data["success"] = false;
            }else data["success"] = true;
            res.json(data);
        });
    }else{
        data["success"] = "Please provide all required data (i.e : Username, Email, Password, Phone)";
        res.json(data);
    }
});


//SIGN IN

app.post('/api/users/login',function(req,res){
    var Username = req.body.username;
    var Password = req.body.password;
    const hash = crypto.createHash('sha256');
    hash.update(S(Username).toString()+S(Password).toString());
    var success = {
        "success": true,
        "session" : hash.digest('hex')
    };
    var notavaible = {
        "success": "Please provide all required data (i.e : Username, Password)"
    };
    var nonsuccess = {
        "success":false,
        "error": code = {
            "code":123,
            "message":"Invalid username or password"
        }
    };

    
    if(!!Username && !!Password){
        connection.query("SELECT ID FROM user WHERE username=? AND password=?",[Username,Password],function(err, rows, fields){
            if(rows.length!=0){
                sessionid = success["session"];
                res.json(success);
            } else {
                res.json(nonsuccess);
            }
        });
    }else{
        res.json(notavaible);
    }
});
//CHANGE PASSWORD

app.post('/api/users/password',function(req,res){
    var Username = req.body.username;
    var SesionIDinput = req.body.session_id;
    var newPassword = req.body.new_password;
    const hash = crypto.createHash('sha256');
    hash.update(S(Username).toString()+S(newPassword).toString());
    var success = {
        "success": true,
        "session" : hash.digest('hex')
    };
    var notavaible = {
        "success": "Please provide all required data (i.e : Username, Session, Password)"
    };
    var nonsuccess = {
        "success":false,
        "error": code = {
            "code":34567,
            "message":"Invalid session id"
        }
    };

    
    if(!!Username && !! SesionIDinput && !!newPassword){
        if(sessionid==SesionIDinput){
            connection.query("UPDATE user SET password=? WHERE username=?",[newPassword,Username],function(err, rows, fields){
                if(!!err){
                    res.json(nonsuccess);
                } else {
                    res.json(success);
                }
            });
        }else{
            res.json(nonsuccess);
        }
    }else{
        res.json(notavaible);
    }
});
/*-----------------------DELETE Method-----------------------*/

app.post('/api/users/remove',function(req,res){
    var Username = req.body.username;
    var SesionIDinput = req.body.session_id;

    var success = {
        "success": true
        };
    var notavaible = {
        "success": "Please provide all required data (i.e : Username, Session)"
    };
    var nonsuccess = {
        "success":false,
        "error": code = {
            "code":2432,
            "message":"Invalid session id"
        }
    };

    
    if(!!Username && !! SesionIDinput){
        if(sessionid==SesionIDinput){
            connection.query("DELETE FROM user WHERE username=?",[Username],function(err, rows, fields){
                if(!!err){
                    res.json(nonsuccess);
                } else {
                    res.json(success);
                }
            });
        }else{
            res.json(nonsuccess);
        }
    }else{
        res.json(notavaible);
    }
});





app.listen(1234); //Cong danh cho Viec truy cap Database


server.listen(5678,ip, function(){ //Cong danh cho viec Client lay duu lieu
    console.log("Listen: " + ip + ":" + 5678);
});
