var express 		= require('express'); 
var app 		= express();

var bodyParser  = require('body-parser');

app.set('port', 8040);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // for parsing application/x-www-form-urlencoded

app.use('/', express.static('../VRD_draft/'));

app.listen(app.get('port'), function(){
  console.log("Node app is running at localhost:" + app.get('port'));
});
