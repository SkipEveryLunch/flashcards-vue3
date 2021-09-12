import SectionsPage from './SectionsPage.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import store from '../../store/index.ts';
import userEvent from '@testing-library/user-event';
import { server, sectionsData } from '../../mocks/mockServer';

const setup = () => {
  render(SectionsPage, {
    global: { plugins: [router, store] },
  });
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

it('has the same number of sectionCards as API sent', async () => {
  setup();
  const sectionCards = await screen.findAllByTestId('section-card');
  expect(sectionCards.length).toBe(sectionsData.length);
});
