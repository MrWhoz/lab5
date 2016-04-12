var express = require('express');
var mysql = require('mysql');
var app = express();
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'lab5db'
});
connection.connect(function(error){
	if(!!error){
		console.log('Error!!!');
	} else{
		console.log("Connected");
	}
});
app.get('/',function(req, resp){
	//About mysql working on it
	// console.log('');
	connection.query("SELECT * FROM  sample", function(error, row, fields ){
		//callback function
		if (!!error) {
			console.log('Error in the query');
		} else{
			console.log('Connection is 200!');
			console.log(rows);
		}
	});
})

app.listen(1212);