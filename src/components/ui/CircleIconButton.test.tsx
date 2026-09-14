/**
 * The shared circular icon button gives the icon a fixed square hit area and
 * centers it via flexbox — the fix for glyphs sitting up-and-left of their
 * circle. These lock in the centering contract and press forwarding.
 */
import React from 'react';
import { Pressable, Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { CircleIconButton } from './CircleIconButton';

const render = (props: Record<string, unknown> = {}) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      React.createElement(CircleIconButton, props as any, React.createElement(Text, null, 'x')),
    );
  });
  return tree.root.findByType(Pressable);
};

test('applies a fixed square size (default 40) as the tap target', () => {
  const style = render().props.style;
  const flat = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;
  expect(flat.width).toBe(40);
  expect(flat.height).toBe(40);
});

test('honours a custom size', () => {
  const style = render({ size: 34 }).props.style;
  const flat = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;
  expect(flat.width).toBe(34);
  expect(flat.height).toBe(34);
});

test('centers its content and clips to a circle', () => {
  const className = String(render().props.className);
  expect(className).toContain('items-center');
  expect(className).toContain('justify-center');
  expect(className).toContain('rounded-full');
});

test('merges an extra className (e.g. absolute positioning)', () => {
  const className = String(render({ className: 'absolute right-1 top-1' }).props.className);
  expect(className).toContain('absolute');
  expect(className).toContain('rounded-full');
});

test('forwards presses', () => {
  const onPress = jest.fn();
  render({ onPress }).props.onPress();
  expect(onPress).toHaveBeenCalled();
});
