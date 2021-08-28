import { setupServer } from 'msw/node';
import { rest } from 'msw';

const baseUrl = 'http://localhost:8000/api/';

export const capitalize = (letter) => {
  let result;
  if (!letter.includes('-')) {
    result = letter.charAt(0).toUpperCase() + letter.slice(1);
  } else {
    result = letter
      .split('-')
      .map((el) => {
        return el.charAt(0).toUpperCase() + el.slice(1);
      })
      .join(' ');
  }
  return result;
};
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
