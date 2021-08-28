import RegisterPage from './RegisterPage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

it('has Name Input', async () => {
  render(RegisterPage);
  const nameInput = screen.queryByTestId('name-input');
  expect(nameInput).toBeInTheDocument();
});

it('has Name Input which has the value user input', async () => {
  render(RegisterPage);
  const nameInput = screen.queryByTestId('name-input');
  const str = 'test';
  await userEvent.type(nameInput, str);
  expect(nameInput.value).toBe(str);
});

it('has Email Input', async () => {
  render(RegisterPage);
  const emailInput = screen.queryByTestId('email-input');
  expect(emailInput).toBeInTheDocument();
});

it('has Email Input which has the value user input', async () => {
  render(RegisterPage);
  const emailInput = screen.queryByTestId('email-input');
  const str = 'test';
  await userEvent.type(emailInput, str);
  expect(emailInput.value).toBe(str);
});

it('has Password Input', async () => {
  render(RegisterPage);
  const passwordInput = screen.queryByTestId('password-input');
  expect(passwordInput).toBeInTheDocument();
});

it('has Password Input which has the value user input', async () => {
  render(RegisterPage);
  const passwordInput = screen.queryByTestId('password-input');
  const str = 'test';
  await userEvent.type(passwordInput, str);
  expect(passwordInput.value).toBe(str);
});

it('has Password Confirm Input', async () => {
  render(RegisterPage);
  const passwordConfirmInput = screen.queryByTestId('password-confirm-input');
  expect(passwordConfirmInput).toBeInTheDocument();
});

it('has Password Confirm Input which has the value user input', async () => {
  render(RegisterPage);
  const passwordConfirmInput = screen.queryByTestId('password-confirm-input');
  const str = 'test';
  await userEvent.type(passwordConfirmInput, str);
  expect(passwordConfirmInput.value).toBe(str);
});

it('has Register Button', async () => {
  render(RegisterPage);
  const registerButton = screen.queryByTestId('register-button');
  expect(registerButton).toBeInTheDocument();
});
