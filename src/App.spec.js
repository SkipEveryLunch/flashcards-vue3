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
  beforeEach(() => store.dispatch('discardUser'));

  it('does not show ProfileLink before logging in', async () => {
    await setup('/');
    const ProfileLink = screen.queryByTestId('profile-link');
    expect(ProfileLink).not.toBeInTheDocument();
  });

  it('shows LoginPage after registeration', async () => {
    await setup('/register');
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
    const loginPage = await screen.findByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  it('shows profileLink after logging in', async () => {
    await setup('/login');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    userEvent.click(loginButton);
    const profileLink = await screen.findByTestId('profile-link');
    expect(profileLink).toBeInTheDocument();
  });

  it('does not show profileLink after logging out', async () => {
    await setup('/login');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    await userEvent.click(loginButton);
    const logoutLink = await screen.findByTestId('logout-link');
    const profileLink = await screen.findByTestId('profile-link');
    userEvent.click(logoutLink);
    await waitForElementToBeRemoved(logoutLink);
    expect(profileLink).not.toBeInTheDocument();
  });

  it('shows SectionPage after logging out', async () => {
    await setup('/login');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    await userEvent.click(loginButton);
    const logoutLink = await screen.findByTestId('logout-link');
    const profileLink = await screen.findByTestId('profile-link');
    userEvent.click(logoutLink);
    await waitForElementToBeRemoved(logoutLink);
    const sectionPage = await screen.findByTestId('section-page');
    expect(sectionPage).toBeInTheDocument();
  });

  it('shows profile page after click profile link', async () => {
    await setup('/login');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    userEvent.click(loginButton);
    const profileLink = await screen.findByTestId('profile-link');
    userEvent.click(profileLink);
    const profilePage = await screen.findByTestId('profile-page');
    expect(profilePage).toBeInTheDocument();
  });
});
