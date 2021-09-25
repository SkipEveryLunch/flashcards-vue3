import SectionEditPage from './SectionEditPage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import userEvent from '@testing-library/user-event';
import store from '../../store/index.ts';
import { server, reqBody, userData, sectionData } from '../../mocks/mockServer';
import { rest } from 'msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

const setup = () => {
  render(SectionEditPage, {
    global: { plugins: [router, store] },
  });
};

it('shows not found message when not logged in', async () => {
  await setup();
  const notFoundMessage = screen.getByTestId('not-found-message');
  expect(notFoundMessage).toBeInTheDocument();
});

it('shows section title when logged in', async () => {
  store.dispatch('setUser', userData);
  await setup();
  const title = await screen.findByText(sectionData.title);
  expect(title).toBeInTheDocument();
});

it('shows the same number of questions as the server returned', async () => {
  store.dispatch('setUser', userData);
  await setup();
  const questions = await screen.findAllByTestId('question-card');
  expect(questions.length).toBe(sectionData.questions.length);
});
