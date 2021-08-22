import App from './App.vue';
import { render, screen } from '@testing-library/vue';
import '@testing-library/jest-dom';

it('has Hi', () => {
  render(App);
  const header = screen.queryByRole('heading', { name: 'Hi' });
  expect(header).toBeInTheDocument();
});
