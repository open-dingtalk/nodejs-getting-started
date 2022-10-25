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

  @Post('/sendText')
  async sendText(@Body('openConversationId') cid, @Body('txt') txt) {
    const result = await this.cardService.sendGroupMessage({
      msgParam: JSON.stringify({
        content: 'nodejs-getting-started say : ' + txt || '今天吃肘子',
      }),
      msgKey: 'sampleText',
      openConversationId: cid,
    });
    return { success: true, code: 200, message: 'OK', data: result };
  }

  @Post('/sendMessageCard')
  async sendMessageCard(@Body('openConversationId') cid) {
    const result = await this.cardService.sendInteractiveCard(cid);
    return { success: true, code: 200, message: 'OK', data: result };
  }

  @Post('/sendTopCard')
  async sendTopCard(@Body('openConversationId') cid) {
    const result = await this.cardService.sendTopCard(cid);
    return { success: true, code: 200, message: 'OK', data: result };
  }

  @Get('/getJsapiTicket')
  async getJsapiTicket(access_token: string) {
    const response = await makeHttpRequest(
      `https://oapi.dingtalk.com/get_jsapi_ticket?access_token=${access_token}`,
      {
        dataType: 'json',
      }
    );
    return response.data.ticket;
  }

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

  @Get('/getUserInfo')
  async getUserInfo(@Query('requestAuthCode') requestAuthCode) {
    const result = await this.userService.getUserInfo(requestAuthCode);
    return { success: true, code: 200, message: 'OK', data: result };
  }

  @Get('/getUserProfiler')
  async getUserProfile(@Query('uid') uid) {
    const result = await this.userService.getUserProfile(uid);
    return { success: true, code: 200, message: 'OK', data: result };
  }
  
  @Get('/getSSOUserInfo')
  async getSSOUserInfo(@Query('requestAuthCode') requestAuthCode) {
    const result = await this.userService.getSSOUserInfo(requestAuthCode);
    return { success: true, code: 200, message: 'OK', data: result };
  }
}
