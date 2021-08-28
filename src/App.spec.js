import App from './App.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from './router/index.ts';
import store from './store/index.ts';
import userEvent from '@testing-library/user-event';

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
