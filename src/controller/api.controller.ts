import {
  Inject,
  Controller,
  Get,
  Query,
  Body,
  Post,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { CardService } from '../service/card.service';
import { makeHttpRequest } from '@midwayjs/core';
import CryptoJS from 'crypto-js';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  cardService: CardService;

  /**
   * 通过机器人发送普通消息
   * @param cid 群ID
   * @param txt 文本
   * @returns { success: true, code: 200, message: 'OK', data: result }
   */
  @Post('/sendText')
  async sendText(@Body('openConversationId') cid, @Body('txt') txt) {
    const result = await this.cardService.sendGroupMessage({
      msgParam: JSON.stringify({
        content: 'nodejs-getting-started say : ' + txt || '钉钉,让进步发生',
      }),
      msgKey: 'sampleText',
      openConversationId: cid,
    });
    return { success: true, code: 200, message: 'OK', data: result };
  }

  /**
   * 通过机器人发送互动卡片
   * @param cid 群ID
   * @returns { success: true, code: 200, message: 'OK', data: result }
   */
  @Post('/sendMessageCard')
  async sendMessageCard(@Body('openConversationId') cid) {
    const result = await this.cardService.sendInteractiveCard(cid);
    return { success: true, code: 200, message: 'OK', data: result };
  }

  /**
   * 通过机器人发送吊顶卡片
   * @param cid 群ID
   * @returns
   */
  @Post('/sendTopCard')
  async sendTopCard(@Body('openConversationId') cid) {
    const result = await this.cardService.sendTopCard(cid);
    return { success: true, code: 200, message: 'OK', data: result };
  }

  /**
   * 获取jsapi鉴权ticket
   * @param access_token
   * @returns
   */
  @Get('/getJsapiTicket')
  async getJsapiTicket(access_token: string) {
    const response: any = await makeHttpRequest(
      `https://oapi.dingtalk.com/get_jsapi_ticket?access_token=${access_token}`,
      {
        dataType: 'json',
      }
    );
    return response.data?.ticket;
  }

  /**
   * 生成签名串
   * @param ticket
   * @param timeStamp
   * @param url
   * @param nonce
   * @returns 签名串
   */
  getJsApiSingnature(ticket, timeStamp, url, nonce = 'jsapi') {
    const plainTex =
      'jsapi_ticket=' +
      ticket +
      '&noncestr=' +
      nonce +
      '&timestamp=' +
      timeStamp +
      '&url=' +
      url;
    const signature = CryptoJS.SHA1(plainTex).toString();
    return signature;
  }

  /**
   * 获取鉴权信息
   * @param url
   * @param agentId
   * @returns
   */
  @Get('/getConfigData')
  async getConfigData(@Query('url') url, @Query('agentId') agentId) {
    const access_token = await this.userService.getToken();
    const ticket = await this.getJsapiTicket(access_token);
    const timeStamp = +new Date();
    const nonceStr = 'jsapi';
    const signature = this.getJsApiSingnature(
      ticket,
      timeStamp,
      decodeURIComponent(url as string),
      nonceStr
    );

    return {
      agentId,
      timeStamp,
      nonceStr,
      signature,
    };
  }

  /**
   * 通过授权码获取用户信息
   * @param requestAuthCode
   * @returns
   */
  @Get('/getUserInfo')
  async getUserInfo(@Query('requestAuthCode') requestAuthCode) {
    const result = await this.userService.getUserInfo(requestAuthCode);
    return { success: true, code: 200, message: 'OK', data: result };
  }
}
