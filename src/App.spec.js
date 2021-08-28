import App from './App.vue';
import { render, screen } from '@testing-library/vue';
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
  await userEvent.click(loginLink);
  const loginPage = await screen.findByTestId('login-page');
  expect(loginPage).toBeInTheDocument();
});

describe('interaction with API', () => {
  it('does not show ProfileLink before logging in', async () => {
    await setup('/');
    const ProfileLink = screen.queryByTestId('profile-link');
    expect(ProfileLink).not.toBeInTheDocument();
  });

  it('shows ProfileLink after logging in', async () => {
    await setup('/login');
    const loginButton = screen.queryByTestId('login-button');
    await userEvent.click(loginButton);
    const ProfileLink = await screen.findByTestId('profile-link');
    expect(ProfileLink).toBeInTheDocument();
  });
});
