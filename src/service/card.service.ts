import { Provide, Config, Logger, Inject } from '@midwayjs/decorator';
import { ICardInfoRequest, IGroupMessagesRequest } from '../interface';
import { makeHttpRequest, MidwayError } from '@midwayjs/core';
import { ILogger } from '@midwayjs/logger';
import { UserService } from './user.service';

@Provide()
export class CardService {
  @Config('coolAppConfig')
  demoConfig;

  @Logger()
  logger: ILogger;

  @Inject()
  userService: UserService;

  /**
   * 发送群消息
   */
  async sendGroupMessage(request: IGroupMessagesRequest) {
    const access_token = await this.userService.getToken();
    const body = {
      msgParam: request.msgParam,
      msgKey: request.msgKey,
      openConversationId: request.openConversationId,
      robotCode: request.robotCode || this.demoConfig.robotCode,
      coolAppCode: request.coolAppCode || this.demoConfig.coolAppCode,
    };
    try { // https://open.dingtalk.com/document/group/the-robot-sends-a-group-message
      const result = await makeHttpRequest(
        `https://api.dingtalk.com//v1.0/robot/groupMessages/send`,
        {
          method: 'POST',
          dataType: 'json',
          contentType: 'json',
          data: body,
          headers: {
            'x-acs-dingtalk-access-token': access_token,
          },
        }
      );
      this.logger.info(JSON.stringify(result.data));
      return result.data;
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

  /**
   * 向群里发送互动卡片
   */
  async sendInteractiveCard(cid: string) {
    const access_token = await this.userService.getToken();
    // 卡片模板，卡片数据结构需要去 卡片模板-数据源 里查看
    // https://h5.dingtalk.com/interactive-card-builder/index.html#/editor?id=9b705ffa-b47e-4952-bfa5-dabed67c8572
    const data: ICardInfoRequest = {
      cardTemplateId: this.demoConfig.messageCardTemplateId001,
      openConversationId: cid,
      cardBizId: `instance_3_${this.demoConfig.messageCardTemplateId001}`,
      robotCode: this.demoConfig.robotCode,
      cardData: JSON.stringify({
        title: '来自nodejs-getting-started',
        videoUrl:'https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/d/ud/352793594610.mp4',
      }),
    };

    try { // https://open.dingtalk.com/document/group/robots-send-interactive-cards
      const result = await makeHttpRequest(
        `https://api.dingtalk.com/v1.0/im/v1.0/robot/interactiveCards/send`,
        {
          dataType: 'json',
          method: 'POST',
          contentType: 'json',
          data,
          headers: {
            'x-acs-dingtalk-access-token': access_token,
          },
        }
      );
      return result.data;
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

  /**
   * 发送吊顶卡片
   */
  async sendTopCard(cid: string) {
    const access_token = await this.userService.getToken();
    const outTrackId = `instance_4_${this.demoConfig.topCardTemplateId001}`;
    // 卡片模板，卡片数据结构需要去 卡片模板-数据源 里查看
    // https://h5.dingtalk.com/interactive-card-builder/index.html#/editor?id=9b705ffa-b47e-4952-bfa5-dabed67c8572
    const data: ICardInfoRequest = {
      cardTemplateId: this.demoConfig.topCardTemplateId001,
      openConversationId: cid,
      outTrackId,
      robotCode: this.demoConfig.robotCode,
      conversationType:1,
      cardData: {
        cardParamMap:{
          "total": "20",
          "finished": "17",
          "progress": "65",
          "yesterdayNew": "2",
          "yesterdayFinished": "3"
        }
      },
    };

    try { // https://open.dingtalk.com/document/orgapp-server/create-an-interactive-card-instance-1
      const result = await makeHttpRequest(
        `https://api.dingtalk.com/v1.0/im/interactiveCards/instances`,
        {
          dataType: 'json',
          method: 'POST',
          contentType: 'json',
          data,
          headers: {
            'x-acs-dingtalk-access-token': access_token,
          },
        }
      );
      if(result && result.data && result.data.processQueryKey){
        const topResult = await makeHttpRequest(
          `https://api.dingtalk.com/v1.0/im/topBoxes/open`,
          {
            dataType: 'json',
            method: 'POST',
            contentType: 'json',
            data:{
              outTrackId,
              openConversationId:cid,
              expiredTime:Date.now() + 24 * 60 * 1000,
              coolAppCode:this.demoConfig.coolAppCode
            },
            headers: {
              'x-acs-dingtalk-access-token': access_token,
            },
          }
        );
        return topResult.data;
      }
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }
}
