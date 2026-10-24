import test from 'node:test';
import assert from 'node:assert/strict';

import { findServiceMatch } from '../utils/serviceMatcher.js';

const services = [
  {
    name: 'Bonafide Certificate',
    keywords: ['bonafide', 'bonafide certificate', 'bona fide']
  },
  {
    name: 'Exam Form',
    keywords: ['exam form', 'exam', 'examination form']
  }
];

test('matches bonafide certificate queries to the correct service', () => {
  const match = findServiceMatch('I need a bonafide certificate', services);
  assert.equal(match?.name, 'Bonafide Certificate');
});

test('matches exam form queries to the correct service', () => {
  const match = findServiceMatch('I need an exam form for my semester', services);
  assert.equal(match?.name, 'Exam Form');
});
