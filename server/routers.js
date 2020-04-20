/**
 * 路由管理文件
 */
var http = require('http');

module.exports = function (app) {
    app.get('/hello',(req,res) => {
        res.end('hello,world')
    })

    app.post('/testa',(req,res) => {
        new Promise(resolve=>{
            http.get('http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz002681&scale=60&ma=5&datalen=1023',function(resA){
                var data = '';
                resA.on('data',function(chunk){
                    data += chunk;
                });
                resA.on('end',function(){
                    console.log("type",typeof data)
                    resolve(data)
                })
            })
        }).then(data=>{
            res.json({
                str:data
            })
        })
        
    })
}
