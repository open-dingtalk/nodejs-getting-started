/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

export interface IGroupMessagesRequest{
  msgParam : string;
  msgKey : string;
  openConversationId?: string;
  robotCode? : string;
  coolAppCode?: string;
}

export interface ICardInfoRequest{
    cardTemplateId : string;
    openConversationId : string;
    singleChatReceiver? : string;
    cardBizId? : string;
    outTrackId?: string;
    robotCode : string;
    conversationType?: number;
    callbackUrl? : string;
    cardData? : string|object;
    userIdPrivateDataMap? : string;
    unionIdPrivateDataMap? : string;
    sendOptions?: {
      atUserListJson? : string;
      atAll : boolean,
      receiverListJson : string;
      cardPropertyJson : string;
    },
    pullStrategy? : boolean;
}

export interface ISendCardRequset {
  title: string;
  deadline: string;
  maximum: number;
  openConversationId: string;
}
