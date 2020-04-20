const Controller = require('egg').Controller;

module.exports = class PostController extends Controller{
    async getData(req,res){
        const result = await this.ctx.curl("http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz002681&scale=60&ma=5&datalen=1023",
            {}
        );
        if (result.status === 200) {
            console.log("result",result)
            res.end(result.data);
        }else{
            res.end("错误")
        }
        return
    }
}