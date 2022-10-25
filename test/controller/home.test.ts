import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/controller/home.test.ts', () => {

  it('should GET /index.htm', async () => {
    // create app
    const app = await createApp<Framework>();

    // make request
    const result = await createHttpRequest(app).get('/index.htm');

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.text).toMatch(/酷应用getting started/);

    // close app
    await close(app);
  });

});
