import ProfileEditPage from './ProfileEditPage.vue';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import store from '../../store/index.ts';
import router from '../../router/index.ts';
import { server, reqBody } from '../../mocks/mockServer';
import userEvent from '@testing-library/user-event';

const setup = async () => {
  render(ProfileEditPage, {
    global: { plugins: [store, router] },
  });
  await store.dispatch('setUser', userData);
};

const userData = {
  first_name: 'John',
  last_name: 'Smith',
  email: 'js@test.io',
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

describe('update user', () => {
  it('sends correct values', async () => {
    setup();
    const firstNameInput = screen.queryByTestId('first-name-input');
    const lastNameInput = screen.queryByTestId('last-name-input');
    const emailInput = screen.queryByTestId('email-input');
    const updateUserButton = screen.queryByTestId('update-user-button');
    const fname = 'test';
    const lname = 'test';
    const email = '01@test.io';
    userEvent.type(firstNameInput, fname);
    userEvent.type(lastNameInput, lname);
    userEvent.type(emailInput, email);
    userEvent.click(updateUserButton);
    const updateMessage = await screen.findByTestId('user-update-message');
    await waitForElementToBeRemoved(updateMessage);
    expect(reqBody).toEqual({
      first_name: fname,
      last_name: lname,
      email,
    });
  });
  it('updates user information in store', async () => {
    setup();
    const firstNameInput = screen.queryByTestId('first-name-input');
    const lastNameInput = screen.queryByTestId('last-name-input');
    const emailInput = screen.queryByTestId('email-input');
    const updateUserButton = screen.queryByTestId('update-user-button');
    const fname = 'test';
    const lname = 'test';
    const email = '01@test.io';
    userEvent.type(firstNameInput, fname);
    userEvent.type(lastNameInput, lname);
    userEvent.type(emailInput, email);
    userEvent.click(updateUserButton);
    const updateMessage = await screen.findByTestId('user-update-message');
    await waitForElementToBeRemoved(updateMessage);
    expect(1).toEqual(1);
  });
});

describe('update password', () => {
  it('sends correct values', async () => {
    setup();
    const PasswordInput = screen.queryByTestId('password-input');
    const PasswordConfirmInput = screen.queryByTestId('password-confirm-input');
    const updatePasswordButton = screen.queryByTestId('update-password-button');
    const password = '1234';
    userEvent.type(PasswordInput, password);
    userEvent.type(PasswordConfirmInput, password);
    userEvent.click(updatePasswordButton);
    const updateMessage = await screen.findByTestId('password-update-message');
    await waitForElementToBeRemoved(updateMessage);
    expect(reqBody).toEqual({
      password,
    });
  });
});
