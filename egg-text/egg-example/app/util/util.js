const Service = require('egg').Service;

class spiderService extends Service {
    async getData(page) {
        let url = 'https://www.jianshu.com/p/caa89f0b0a39';
        const result = awaitthis.ctx.curl(url,{
            dataType:'text',
        })
        return result
    }
}