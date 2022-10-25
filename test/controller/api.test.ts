import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/api.test.ts', () => {
  it('should POST /api/sendText', async () => {
    // create app
    const app = await createApp<Framework>();

    // make request
    const result = await (await createHttpRequest(app).post('/api/sendText')).body({ cid: 123, txt: 'test' });

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('OK');

    // close app
    await close(app);
  });
});
