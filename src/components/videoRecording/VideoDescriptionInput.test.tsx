/**
 * The caption card is always visible and shows a live n/limit counter against
 * the single shared DescriptionMaxLength.
 */
import React from 'react';
import { Text, TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

// The ui barrel pulls in reanimated (via AnimatedChar), which jest doesn't
// transform; the card only needs SvgIcon, so stub it.
jest.mock('../ui', () => ({ SvgIcon: () => null }));

const {
  DescriptionMaxLength,
  VideoDescriptionInput,
} = require('./VideoDescriptionInput');

const render = (value: string) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      React.createElement(VideoDescriptionInput, { value, setValue: jest.fn() }),
    );
  });
  return tree;
};

const counterText = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType(Text)
    .map((n) => (Array.isArray(n.props.children) ? n.props.children.join('') : n.props.children))
    .find((t) => typeof t === 'string' && t.includes('/'));

test('the limit is 600 (the shared constant)', () => {
  expect(DescriptionMaxLength).toBe(600);
});

test('the input is always present (no tap-to-expand)', () => {
  expect(render('').root.findAllByType(TextInput)).toHaveLength(1);
});

test('the counter reflects the current length against the limit', () => {
  expect(counterText(render(''))).toBe('0/600');
  expect(counterText(render('hello'))).toBe('5/600');
});

test('the input enforces the limit via maxLength', () => {
  const input = render('x').root.findByType(TextInput);
  expect(input.props.maxLength).toBe(DescriptionMaxLength);
});

test('shows the caption placeholder', () => {
  const input = render('').root.findByType(TextInput);
  expect(input.props.placeholder).toBe('Write a caption...');
});
