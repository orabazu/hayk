var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/client'));

app.listen(process.env.PORT || 8080, function () {
	console.log(__dirname + '/app');
  console.log('trekkinn on port 8080');
});

