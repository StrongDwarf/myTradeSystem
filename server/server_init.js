var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/faceTest');
var app = express();
var http = require('http').Server(app);

// 自定义一个CORS中间件
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); 
    console.log("调用接口:",req.path);
	next();
};

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json({'limit':'100000000000kb'}));
app.use(bodyParser());
app.use(allowCrossDomain);

// 导入路由模块和websocket模块
require('./routers_init')(app);
http.listen(8083);


//输出当前端口号
(function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                console.log("ip:"+alias.address+":8083");
            }
        }
    }
})()
