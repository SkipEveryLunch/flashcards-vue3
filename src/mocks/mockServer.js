import { setupServer } from 'msw/node';
import { rest } from 'msw';

const baseUrl = 'http://localhost:8000/api/';

export let reqBody;
export const server = setupServer(
  rest.post(`${baseUrl}register`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(200));
  }),
  rest.post(`${baseUrl}login`, (req, res, ctx) => {
    reqBody = req.body;
    return res(
      ctx.status(200),
      ctx.cookie('token', '12345'),
      ctx.json({ user: userData })
    );
  }),
  rest.delete(`${baseUrl}logout`, (req, res, ctx) => {
    reqBody = req.body;
    return res(
      ctx.status(200),
      ctx.cookie('token', '', { maxAge: 0 }),
      ctx.json({ user: userData })
    );
  }),
  rest.get(`${baseUrl}user`, (req, res, ctx) => {
    const { token } = req.cookies;
    if (token && token === '12345') {
      return res(ctx.status(200), ctx.json(userData));
    } else {
      return res(ctx.status(401), ctx.json({ message: 'not authenticated' }));
    }
  })
);
const userData = {
  first_name: 'John',
  last_name: 'Smith',
  email: 'js@test.io',
};
