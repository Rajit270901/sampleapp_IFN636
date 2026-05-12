import { render, screen } from '@testing-library/react'; // testing helpers for rendering and finding elements https://www.w3schools.com/react/react_testing.asp
import App from './App'; // imports main app component for the test

test('renders learn react link', () => { // defines one test case https://www.w3schools.com/js/js_arrow_function.asp
  render(<App />); // renders the App component in the test environment
  const linkElement = screen.getByText(/learn react/i); // finds text using case insensitive regex https://www.w3schools.com/js/js_regexp.asp
  expect(linkElement).toBeInTheDocument(); // checks that the element exists on the page
});
