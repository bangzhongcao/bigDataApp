var express =  require('express');
var app = express();
app.use(express.static('www'));
exports = module.exports = function(path){
	app.get("/", function(req,res){
		res.sendFile(_dirname+"/"+path);
	});
	app.listen(8000);
	console.log('server start!');    
}