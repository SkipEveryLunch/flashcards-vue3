import ProfilePage from './ProfilePage.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';
import store from '../../store/index.ts';

const setup = async () => {
  render(ProfilePage, {
    global: { plugins: [store] },
  });
  await store.dispatch('setUser', userData);
};

const userData = {
  first_name: 'John',
  last_name: 'Smith',
  email: 'js@test.io',
};

it('shows first name', async () => {
  setup();
  const userFirstName = await screen.findByTestId('user-firstname');
  expect(userFirstName.textContent).toBe(userData.first_name);
});

it('shows last name', async () => {
  setup();
  const userLastName = await screen.findByTestId('user-lastname');
  expect(userLastName.textContent).toBe(userData.last_name);
});

it('shows Email', async () => {
  setup();
  const userEmail = await screen.findByTestId('user-email');
  expect(userEmail.textContent).toBe(userData.email);
});
