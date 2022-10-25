import React, { useState, useEffect } from 'react';
import './index.less';
import axios from 'axios';
import { Button, Form, Input, Card, Toast, Divider } from 'dingtalk-design-mobile';
import * as dd  from 'dingtalk-jsapi';


const Home: React.FC = () => {
  const query = new URLSearchParams(location.search);
  const [openConversationId] = useState(() => {
    return query.get('openConversationId') || '';
  });

  const [userInfo, setUserInfo] = useState<any>({});
  const [form] = Form.useForm<{
    title: string;
  }>()

  useEffect(() => {
    dd.runtime.permission.requestAuthCode({
      corpId: query.get('corpId')||query.get('corpid')||'', // 企业id
    }).then((info)=>{
      console.log('info', info);
        const code = info.code; // 通过该免登授权码可以获取用户身份
        axios.get('/api/getUserInfo', {
          params:{
            requestAuthCode:code
          }
        }).then((result)=>{
          return result.data;
        }).then((res)=>{
          console.log(res.data);
          setUserInfo(res.data);
        });
    }).catch((err)=>{
      console.error('获取授权码失败：'+err);
    });
  }, []);

  const handleSubmit = React.useCallback(async () => {
    const { title } = form.getFieldsValue();
    axios
      .post('/api/sendText', {
        txt: title,
        openConversationId,
      })
      .then((res) => {
        Toast.success({content:'发送成功'})
      })
      .catch((err) => {
        Toast.fail({content:err.message})
      });
  }, [openConversationId]);

  const sendTopCard = React.useCallback(async () => {
    axios
      .post('/api/sendTopCard', {
        openConversationId,
      })
      .then((res) => {
        Toast.success({content:'发送群吊顶卡片成功'})
      })
      .catch((err) => {
        Toast.fail({content:err.message})
      });
  }, []);

  const sendMessageCard = React.useCallback(async () => {
    axios
      .post('/api/sendMessageCard', {
        txt: '',
        openConversationId,
      })
      .then((res) => {
        Toast.success({content:'发送互动卡片成功'})
      })
      .catch((err) => {
        Toast.fail({content:err.message})
      });
  }, []);

  return (
    <div className='page-container'>
      <div className='top'>
        <h2>酷应用配置成功！</h2>
        <p className='sub-title'>已成功接入账号免登、消息卡片、吊顶卡片功能，点击下方模拟发送体验卡片效果。</p>
      </div>
      <Card title={'已接入钉钉免登录'}>
        <p className='sub-title'>通过钉钉免登录功能，可以XXXXX</p>
        <div className='user-card'>
            <img src={userInfo?.avatar||'https://img.alicdn.com/imgextra/i2/O1CN01dnoCMI21uCfm2PmmU_!!6000000007044-55-tps-93-93.svg'} className="logo" />
            <div>
              <h3>你好，{userInfo?.name}</h3>
            </div>
        </div>
      </Card>
      <Card title={'发送文本信息'}>
        <Form
          name="basic"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item name="title" rules={[{ required: false }]}>
            <Input placeholder="随便输入点什么" />
          </Form.Item>
          <Divider>Text</Divider>
            <Button htmlType="submit" type="primary" block>
              试一试
            </Button>
        </Form>
      </Card>
      <Card title={'已实现的消息卡片'} >
        <div>

        </div>
        <Divider>Text</Divider>
        <Button type="primary" onClick={sendMessageCard} block>
          试一试
        </Button>
      </Card>
      <Card title={'已实现的吊顶卡片'} >
        <div></div>
        <Divider>Text</Divider>
        <Button type="primary" onClick={sendTopCard} block>
          试一试
        </Button>
      </Card>
    </div>
  );
};
export default Home;