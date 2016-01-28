// server.js  
// RestAPI is in this file
     // set up ========================
	var port = process.env.PORT || 8081;
	require('console');
    var express  = require('express');
    var app      = express();                               // create our app express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

  	//mongoose.connect('mongodb://localhost:27017/mean'); //Local dB
	mongoose.connect('mongodb://vvaisan:Miisu#Kiti@waffle.modulusmongo.net:27017/etiRyw3y'); //Remote dB
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
	//app.use(require('browser-logger')()); //Added 7.1.2016, Also %npm install browser-logger. Don't work in heroku server

	var Todo = mongoose.model('Todo', {
        text : String,
		completed:{
			type: Boolean,
  		    default: false 
		},
		note: String,
		updated_at:  {type: Date, default:Date.now }
    });
	app.get('/api/todos', function(req, res) {
	
        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
         Todo.create({
            text : req.body.text,
			completed: req.body.completed,
            note : req.body.note
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

	// update a todo (completed)
    app.put('/api/todos/:todo_id', function(req, res) {
 		Todo.update({_id: req.params.todo_id}, {
        completed: true
		} , function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });
	
	 // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
	 
    // listen (start app with node server.js) ======================================
    app.listen(port);
    console.log("App listening on port" + port);
