import LoginPage from './LoginPage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import store from '../../store/index.ts';
import router from '../../router/index.ts';

const setup = () => {
  render(LoginPage, {
    global: { plugins: [router, store] },
  });
};

it('has Email Input', async () => {
  setup();
  const emailInput = screen.queryByTestId('email-input');
  expect(emailInput).toBeInTheDocument();
});

it('has Email Input which has the value user input', async () => {
  setup();
  const emailInput = screen.queryByTestId('email-input');
  const str = 'test';
  await userEvent.type(emailInput, str);
  expect(emailInput.value).toBe(str);
});

it('has Password Input', async () => {
  setup();
  const passwordInput = screen.queryByTestId('password-input');
  expect(passwordInput).toBeInTheDocument();
});

it('has Password Input which has the value user input', async () => {
  setup();
  const passwordInput = screen.queryByTestId('password-input');
  const str = 'test';
  await userEvent.type(passwordInput, str);
  expect(passwordInput.value).toBe(str);
});

it('has Login Button', async () => {
  setup();
  const loginButton = screen.queryByTestId('login-button');
  expect(loginButton).toBeInTheDocument();
});
