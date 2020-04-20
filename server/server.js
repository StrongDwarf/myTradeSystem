var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/faceTest');

// 自定义一个CORS中间件
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    console.log("调用接口:",req.path);
	next();
};

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json({'limit':'100000000000kb'}));
app.use(bodyParser());
app.use(allowCrossDomain);

// 导入路由模块和websocket模块
require('./routers')(app);
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
