// utils.test.js

import { UUIDv4, generateString, getRandomEmoji, getDate, getLocationName } from './utils.js';

test('UUIDv4 generates a string', () => {
  expect(typeof UUIDv4()).toBe('string');
});

test('generateString generates a string', () => {
  expect(typeof generateString()).toBe('string');
});

test('getRandomEmoji generates a string', () => {
  expect(typeof getRandomEmoji()).toBe('string');
});

test('getDate generates a string', () => {
  expect(typeof getDate()).toBe('string');
});

// getLocationName interacts with the DOM and uses geolocation, which makes it more difficult to test.
// You might need to mock these dependencies to test this function.