import App from './App.vue';
import { rest } from 'msw';
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
import VueClickAway from 'vue3-click-away';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

const setup = async (path) => {
  render(App, {
    global: { plugins: [store, router, VueClickAway] },
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
      const profileMenu = await screen.findByTestId('profile-menu');
      userEvent.click(profileMenu);
      const logoutButton = await screen.findByTestId('logout-button');
      userEvent.click(logoutButton);
      await waitForElementToBeRemoved(logoutButton);
    } catch (e) {}
  });
  beforeEach(() => store.dispatch('discardUser'));

  it('does not show ProfileMenu before logging in', async () => {
    await setup('/');
    const ProfileMenu = screen.queryByTestId('profile-menu');
    expect(ProfileMenu).not.toBeInTheDocument();
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

  it('shows profileMenu after logging in', async () => {
    await setup('/login');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    userEvent.click(loginButton);
    const profileMenu = await screen.findByTestId('profile-menu');
    expect(profileMenu).toBeInTheDocument();
  });

  it('shows Modal after failing loging in', async () => {
    await setup('/login');
    server.use(
      rest.post('http://localhost:8000/api/login', (req, res, ctx) => {
        return res.once(ctx.status(400));
      })
    );
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    userEvent.click(loginButton);
    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();
  });

  it('does not show profileMenu after logging out', async () => {
    await setup('/login');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    await userEvent.click(loginButton);
    const profileMenu = await screen.findByTestId('profile-menu');
    userEvent.click(profileMenu);
    const logoutButton = await screen.findByTestId('logout-button');
    userEvent.click(logoutButton);
    await waitForElementToBeRemoved(logoutButton);
    expect(profileMenu).not.toBeInTheDocument();
  });

  it('shows SectionPage after logging out', async () => {
    await setup('/login');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    await userEvent.click(loginButton);
    const profileMenu = await screen.findByTestId('profile-menu');
    userEvent.click(profileMenu);
    const logoutButton = await screen.findByTestId('logout-button');
    userEvent.click(logoutButton);
    await waitForElementToBeRemoved(logoutButton);
    const sectionPage = await screen.findByTestId('section-page');
    expect(sectionPage).toBeInTheDocument();
  });

  it('shows SectionPage after logging out', async () => {
    await setup('/login');
    const emailInput = screen.queryByTestId('email-input');
    const passwordInput = screen.queryByTestId('password-input');
    await userEvent.type(emailInput, '01@test.io');
    await userEvent.type(passwordInput, '1234');
    const loginButton = screen.queryByTestId('login-button');
    await userEvent.click(loginButton);
    const profileMenu = await screen.findByTestId('profile-menu');
    userEvent.click(profileMenu);
    const logoutButton = await screen.findByTestId('logout-button');
    userEvent.click(logoutButton);
    await waitForElementToBeRemoved(logoutButton);
    const sectionPage = await screen.findByTestId('section-page');
    expect(sectionPage).toBeInTheDocument();
  });

  it('does not show profile show page before loging in', async () => {
    await setup('/profile_show');
    const loginPage = await screen.findByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  it('does not show profile edit page before loging in', async () => {
    await setup('/profile_edit');
    const loginPage = await screen.findByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  it('does not show password edit page before loging in', async () => {
    await setup('/password_edit');
    const loginPage = await screen.findByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  it('shows modal when password is duplicated', async () => {
    server.use(
      rest.post('http://localhost:8000/api/register', (req, res, ctx) => {
        return res.once(ctx.status(409));
      })
    );
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
    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();
  });

  it('shows modal when unknown registaration error occurred', async () => {
    server.use(
      rest.post('http://localhost:8000/api/register', (req, res, ctx) => {
        return res.once(ctx.status(400));
      })
    );
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
    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();
  });
});
