import App from './App.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from './router/index.ts';
import store from './store/index.ts';
import userEvent from '@testing-library/user-event';
import { server } from './mocks/mockServer';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

const setup = async (path) => {
  render(App, {
    global: { plugins: [store, router] },
  });
  router.replace(path);
  await router.isReady();
};

it('has Header', async () => {
  await setup('/');
  const header = screen.queryByTestId('header');
  expect(header).toBeInTheDocument();
});

it('shows LoginPage after clicking login link', async () => {
  await setup('/');
  const loginLink = screen.queryByTestId('login-link');
  userEvent.click(loginLink);
  const loginPage = await screen.findByTestId('login-page');
  expect(loginPage).toBeInTheDocument();
});

describe('Authentication', () => {
  afterEach(async () => {
    try {
      const logoutLink = await screen.findByTestId('logout-link');
      userEvent.click(logoutLink);
      await waitForElementToBeRemoved(logoutLink);
    } catch (e) {}
  });

  it('does not show ProfileLink before logging in', async () => {
    await setup('/');
    const ProfileLink = screen.queryByTestId('profile-link');
    expect(ProfileLink).not.toBeInTheDocument();
  });

  it('shows profileLink after logging in', async () => {
    await setup('/login');
    const loginButton = screen.queryByTestId('login-button');
    userEvent.click(loginButton);
    const profileLink = await screen.findByTestId('profile-link');
    expect(profileLink).toBeInTheDocument();
  });

  it('does not show profileLink after logging out', async () => {
    await setup('/login');
    const loginButton = screen.queryByTestId('login-button');
    await userEvent.click(loginButton);
    const logoutLink = await screen.findByTestId('logout-link');
    const profileLink = await screen.findByTestId('profile-link');
    userEvent.click(logoutLink);
    await waitForElementToBeRemoved(logoutLink);
    expect(profileLink).not.toBeInTheDocument();
  });
});
