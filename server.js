var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);
console.log('Server listening on port 8080');

function requestHandler(req, res) {

  var parsedUrl = url.parse(req.url);
  console.log("The Request is: " + parsedUrl.pathname);

  // Read in the file they requested
  fs.readFile(__dirname + parsedUrl.pathname,
    // Callback function, called when reading is complete
    function(err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedUrl.pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(data);
    }
  );
}

var numUsers = 0;
var maxNumUsers = 2;
var users = [];

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    //if (numUsers < maxNumUsers) {
    numUsers++;
    console.log("We have a new client: " + socket.id);


    users.push(socket);
    // console.log(users);

    // for(let i = 0; i<maxNumUsers;i++){
    //
    //   socket.emit('socketid', users[i]);
    // };

    if(users.length>=maxNumUsers){
      // var ids = {x:users[0].id,y:xxxxxx};

      // console.log("Choosen: " + ids.x);
      //io.sockets.emit('painter', ids);
      users[0].emit('painter', "you");
    };

    // When this user "send" from clientside javascript, we get a "message"
    // client side: socket.send("the message");  or socket.emit('message', "the message");

    //
    //
    socket.on('draw', function(data) {
      console.log("got data");
      // console.log(data);
      io.sockets.emit('draw', data);
    });

    socket.on('answer', function(data) {
      console.log("got answer");

      io.sockets.emit('answer', data);
    });


    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      numUsers--;
      for (var i = 0; i < users.length; i++) {
        if (users[i].id == socket.id) {
          users.splice(i,1);
          // console.log(users);
        }
      }
    });
    // } else {
    //   socket.disconnect();
    //
    // }
  }
);
