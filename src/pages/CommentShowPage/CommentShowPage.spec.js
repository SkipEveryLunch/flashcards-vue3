import CommentShowPage from './CommentShowPage.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import { server, userData, commentsData } from '../../mocks/mockServer';
import store from './../../store/index.ts';

const setup = () => {
  render(CommentShowPage, {
    global: { plugins: [router, store] },
  });
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

it('does not show commentCards when not logged in', async () => {
  setup();
  const cannotDisplay = await screen.findByTestId('cannot-display');
  expect(cannotDisplay).toBeInTheDocument();
});

it('does not show commentCards when wrong user is logged in', async () => {
  store.dispatch('setUser', { ...userData, id: 1 });
  setup();
  const cannotDisplay = await screen.findByTestId('cannot-display');
  expect(cannotDisplay).toBeInTheDocument();
});

it('has the same number of commentCards as API sent', async () => {
  store.dispatch('setUser', userData);
  setup();
  const commentCards = await screen.findAllByTestId('comment-card');
  expect(commentCards.length).toBe(commentsData.length);
});
