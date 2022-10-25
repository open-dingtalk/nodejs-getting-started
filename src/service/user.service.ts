import { Provide, Config, Logger } from '@midwayjs/decorator';
import { makeHttpRequest, MidwayError } from '@midwayjs/core';
import { ILogger } from '@midwayjs/logger';
@Provide()
export class UserService {
  @Logger()
  logger: ILogger;

  @Config('demo')
  demoConfig;

  async getUserInfo(requestAuthCode: string) {
    try{
      const access_token = await this.getToken();
      const res = await makeHttpRequest( 
        `https://oapi.dingtalk.com/user/getuserinfo?access_token=${access_token}&code=${requestAuthCode}`,
        {
          dataType: 'json',
          contentType: 'json',
        }
      );
      if(res.data && res.data.userid){
        const info = await this.getUserProfile(res.data.userid);
        if(info){
          return {
            name:res.data.name,
            userid: res.data.userid,
            avatar: info.avatar
          }
        }
      }
    } catch(error){
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

  async getToken() {
    try {
      const result = await makeHttpRequest(
        `https://oapi.dingtalk.com/gettoken?appkey=${this.demoConfig.appKey}&appsecret=${this.demoConfig.appSecret}`,
        {
          dataType: 'json',
        }
      );
      if (result.status === 200) {
        return result.data.access_token;
      }
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

  async getUserProfile(uid: string) {
    try {
      const access_token = await this.getToken();
      const result = await makeHttpRequest( // https://open.dingtalk.com/document/orgapp-server/query-user-details
        `https://oapi.dingtalk.com/topapi/v2/user/get?access_token=${access_token}`,
        {
          dataType: 'json',
          contentType: 'json',
          data: {
            language: 'zh_CN',
            userid: uid,
          },
          method: 'POST',
          headers: {
            'x-acs-dingtalk-access-token': access_token,
          },
        }
      );
      return result.data.result;
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

  async getOAuthToken() {
    try {
      const result = await makeHttpRequest(
        `https://api.dingtalk.com/v1.0/oauth2/accessToken?appkey=${this.demoConfig.appKey}&appsecret=${this.demoConfig.appSecret}`,
        {
          dataType: 'json',
          contentType: 'json',
        }
      );
      if (result.status === 200) {
        return result.data.access_token;
      }
    } catch (error) {
      this.logger.error(error);
      throw new MidwayError(error);
    }
  }

  async getSSOUserInfo(requestAuthCode: string) {
    const access_token = await this.getOAuthToken();
    const res = await makeHttpRequest(
      `https://api.dingtalk.com/v1.0/oauth2/ssoUserInfo?code=${requestAuthCode}`,
      {
        dataType: 'json',
        contentType: 'json',
        headers: {
          'x-acs-dingtalk-access-token': access_token,
        },
      }
    );
    return res.data;
  }
}
