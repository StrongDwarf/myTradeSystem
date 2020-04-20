'use strict';

const Controller = require('egg').Controller;
const util = require('../util/util');

class HomeController extends Controller {
  async get() {
    let ctx = this.ctx;
    const data = await ctx.service.spider.getData('1');
    ctx.body = {
      package: util.handleData(data.data),
    };
  }
}

module.exports = HomeController;
