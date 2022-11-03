import { Controller, Get, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;

  /**
   * 默认首页地址
   */
  @Get('/index.html')
  async home(): Promise<void> {
    await this.ctx.render('index',{});
  }

  
  @Get('/')
  async index(): Promise<void> {
    await this.ctx.redirect('/index.html');
  }
}
