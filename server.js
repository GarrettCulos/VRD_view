var express 		= require('express'); 
var app 				= express();

var bodyParser  = require('body-parser');

// var readline 					= require('readline');
var fs 								= require('fs');

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Oauth
// var google = require('googleapis');
// var OAuth2 = google.auth.OAuth2;

// fs.readFile('client_secret_262744244453.json', 'utf8', function(err,file){
//     if(err){ 
//     	throw err
//     } else {

// 			var client_secret = JSON.parse(file);

// 			var oauth2Client = new OAuth2(client_secret.web.client_id, client_secret.web.client_secret,client_secret.web.redirect_uris);

// 			// generate a url that asks permissions for Googlesheets scopes
// 			var scopes = [
// 			  'https://www.googleapis.com/auth/spreadsheets'
// 			];

// 			var url = oauth2Client.generateAuthUrl({
// 			  access_type: 'online', // 'online' (default) or 'offline' (gets refresh_token)
// 			  scope: scopes // If you only need one scope you can pass it as string
// 			});


// 		  console.log('Visit the url: ', url);
// 		  rl.question('Enter the code here:', function (code) {
// 		    // request access token
// 		    oauth2Client.getToken(code, function (err, tokens) {
// 		      // set tokens to the client
// 		      // TODO: tokens should be set by OAuth2 client.
		      
// 		      oauth2Client.setCredentials(tokens);
// 		      console.log(tokens);
// 		      console.log(oauth2Client);

// 		    });
// 		  });


// 		};
// });

app.set('port', 8040);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // for parsing application/x-www-form-urlencoded


// app.use('/post', require('./routes/googlesheets').googlesheets );
app.use('/', express.static('../VRD_draft/'));

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});
