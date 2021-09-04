import RegisterPage from './RegisterPage.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import router from '../../router/index.ts';
import userEvent from '@testing-library/user-event';
import { server, reqBody } from '../../mocks/mockServer';

it('has First Name Input', async () => {
  render(RegisterPage);
  const nameInput = screen.queryByTestId('first-name-input');
  expect(nameInput).toBeInTheDocument();
});

it('has First Name Input which has the value user input', async () => {
  render(RegisterPage);
  const nameInput = screen.queryByTestId('first-name-input');
  const str = 'test';
  await userEvent.type(nameInput, str);
  expect(nameInput.value).toBe(str);
});

it('has Last Name Input', async () => {
  render(RegisterPage);
  const nameInput = screen.queryByTestId('last-name-input');
  expect(nameInput).toBeInTheDocument();
});

it('has Last Name Input which has the value user input', async () => {
  render(RegisterPage);
  const nameInput = screen.queryByTestId('last-name-input');
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

describe('validation', () => {
  it('has Register Button initially disabled', async () => {
    render(RegisterPage);
    const registerButton = screen.queryByTestId('register-button');
    expect(registerButton).toBeDisabled();
  });

  it('should show alert when the length of first name is more than 12', async () => {
    render(RegisterPage);
    const nameInput = screen.queryByTestId('first-name-input');
    userEvent.type(nameInput, 'aaaaaaaaaaaaa');
    const message = await screen.findByText('名字は12字以内です');
    expect(message).toBeInTheDocument();
  });
  it('should not show alert when the length of first name is less or equal to 12', async () => {
    render(RegisterPage);
    const nameInput = screen.queryByTestId('first-name-input');
    userEvent.type(nameInput, 'aaaaaaaaaaaa');
    const message = screen.queryByText('名前は12字以内です');
    expect(message).not.toBeInTheDocument();
  });
  it('should show alert when the password and password repeat are different', async () => {
    render(RegisterPage);
    const passwordInput = screen.queryByTestId('password-input');
    const passwordRepeatInput = screen.queryByTestId('password-confirm-input');
    userEvent.type(passwordInput, 'aaaa');
    userEvent.type(passwordRepeatInput, 'bbbb');
    const message = await screen.findByText('パスワードと違います');
    expect(message).toBeInTheDocument();
  });

  it('should show alert when an improper email is input', async () => {
    render(RegisterPage);
    const emailInput = screen.queryByTestId('email-input');
    userEvent.type(emailInput, 'aaaatest.io');
    const message = await screen.findByText(
      '正しいメールアドレスを入力して下さい'
    );
    expect(message).toBeInTheDocument();
  });

  it('should not show alert when a proper email is input', async () => {
    render(RegisterPage);
    const emailInput = screen.queryByTestId('email-input');
    userEvent.type(emailInput, 'aaaa@test.io');
    const message = screen.queryByText('正しいメールアドレスを入力して下さい');
    expect(message).not.toBeInTheDocument();
  });

  it.each`
    input                 | jap
    ${`first-name`}       | ${`名字`}
    ${`last-name`}        | ${`名前`}
    ${`email`}            | ${`メールアドレス`}
    ${`password`}         | ${`パスワード`}
    ${`password-confirm`} | ${`パスワード確認`}
  `("should show alert when $input isn't filled in", async (params) => {
    const { input, jap } = params;
    render(RegisterPage);
    const firstNameInput = screen.queryByTestId('first-name-input');
    const lastNameInput = screen.queryByTestId('last-name-input');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    const passwordConfirmInput = screen.queryByTestId('password-confirm-input');
    userEvent.type(firstNameInput, '01');
    userEvent.type(lastNameInput, '01');
    userEvent.type(emailInput, '01@test.io');
    userEvent.type(passwordInput, '1234');
    userEvent.type(passwordConfirmInput, '1234');

    const inputToBlank = screen.queryByTestId(`${input}-input`);
    userEvent.clear(inputToBlank);

    const message = await screen.findByText(`${jap}が未入力です`, {
      exact: false,
    });
    expect(message).toBeInTheDocument();
  });
});

describe('API interaction', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  it('sends proper values', async () => {
    render(RegisterPage, {
      global: { plugins: [router] },
    });
    const firstNameInput = screen.queryByTestId('first-name-input');
    const lastNameInput = screen.queryByTestId('last-name-input');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    const passwordConfirmInput = screen.queryByTestId('password-confirm-input');
    await userEvent.type(firstNameInput, '01');
    await userEvent.type(lastNameInput, '01');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    await userEvent.type(passwordConfirmInput, '1234');
    const registerButton = screen.queryByTestId('register-button');
    userEvent.click(registerButton);
    const registeringMessage = await screen.findByTestId('registering-message');
    await waitForElementToBeRemoved(registeringMessage);
    console.log(reqBody);
    expect(reqBody).toEqual({
      first_name: '01',
      last_name: '01',
      email: '01@test.io',
      password: '1234',
      password_confirm: '1234',
    });
  });
});
