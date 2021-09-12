import { setupServer } from 'msw/node';
import { rest } from 'msw';

const baseUrl = 'http://localhost:8000/api/';

export let reqBody;
export const server = setupServer(
  rest.post(`${baseUrl}register`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(201), ctx.json({ user: userData }));
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
  rest.get(`${baseUrl}current_user`, (req, res, ctx) => {
    const { token } = req.cookies;
    if (token && token === '12345') {
      return res(ctx.status(200), ctx.json({ user: userData }));
    } else {
      return res(ctx.status(401), ctx.json({ message: 'not authenticated' }));
    }
  }),
  rest.put(`${baseUrl}user_update`, (req, res, ctx) => {
    reqBody = req.body;
    const copyUserData = deepCopy(userData);
    Object.assign(copyUserData, req.body);
    return res(ctx.status(200), ctx.json({ user: copyUserData }));
  }),
  rest.put(`${baseUrl}password_update`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(200), ctx.json({ user: userData }));
  }),
  rest.get(`${baseUrl}sections`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(200), ctx.json({ sections: sectionsData }));
  }),
  rest.post(`${baseUrl}sections`, (req, res, ctx) => {
    reqBody = req.body;
    return res(ctx.status(201), ctx.json({ section: sectionsData[0] }));
  })
);
export const userData = {
  first_name: 'John',
  last_name: 'Smith',
  email: 'js@test.io',
};

export const sectionsData = [
  {
    id: 1,
    title: 'enim',
    created_at: '2021-09-11T13:42:10.000000Z',
    updated_at: '2021-09-11T13:42:10.000000Z',
  },
  {
    id: 2,
    title: 'error',
    created_at: '2021-09-11T13:42:10.000000Z',
    updated_at: '2021-09-11T13:42:10.000000Z',
  },
  {
    id: 3,
    title: 'sit',
    created_at: '2021-09-11T13:42:10.000000Z',
    updated_at: '2021-09-11T13:42:10.000000Z',
  },
  {
    id: 4,
    title: 'amet',
    created_at: '2021-09-11T13:42:10.000000Z',
    updated_at: '2021-09-11T13:42:10.000000Z',
  },
];

const deepCopy = (obj) => {
  return [obj].map((ob) => ({ ...ob }))[0];
};
