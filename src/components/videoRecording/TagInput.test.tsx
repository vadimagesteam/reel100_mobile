/**
 * The posting-screen tag input: add via Enter, de-dupe case-insensitively,
 * remove, and stop at the cap. Normalization mirrors the backend.
 */
import React from 'react';
import { Pressable, Text, TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

let mockSuggestions: Array<{ id: string; name: string; label: string }> = [];

jest.mock('./hooks/useTagSuggestions', () => ({
  __esModule: true,
  normalizeTagLabel: (raw: string) => raw.trim().replace(/\s+/g, ' '),
  useTagSuggestions: () => ({ data: mockSuggestions }),
}));

// The ui barrel pulls reanimated (untransformed); the input only needs SvgIcon.
jest.mock('../ui', () => ({ SvgIcon: () => null }));

const { TagInput, MAX_TAGS } = require('./TagInput');

function renderInput(initial: string[] = []) {
  let tags = initial;
  const setTags = jest.fn((next: string[]) => {
    tags = next;
  });
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      React.createElement(TagInput, { tags, setTags }),
    );
  });
  const rerender = (next: string[]) =>
    ReactTestRenderer.act(() => {
      tree.update(React.createElement(TagInput, { tags: next, setTags }));
    });
  return { tree, setTags, rerender };
}

const submit = (tree: ReactTestRenderer.ReactTestRenderer, value: string) => {
  const input = tree.root.findByType(TextInput);
  ReactTestRenderer.act(() => input.props.onChangeText(value));
  ReactTestRenderer.act(() => input.props.onSubmitEditing());
};

beforeEach(() => {
  mockSuggestions = [];
});

test('adds a normalized tag on submit', () => {
  const { tree, setTags } = renderInput([]);
  submit(tree, '  Big   Wave ');
  expect(setTags).toHaveBeenCalledWith(['Big Wave']);
});

test('does not add a case-insensitive duplicate', () => {
  const { tree, setTags } = renderInput(['Surf']);
  submit(tree, 'surf');
  expect(setTags).not.toHaveBeenCalledWith(expect.arrayContaining(['surf']));
});

test('ignores a blank submit', () => {
  const { tree, setTags } = renderInput([]);
  submit(tree, '   ');
  expect(setTags).not.toHaveBeenCalled();
});

test('removes a tag', () => {
  const { tree, setTags } = renderInput(['surf', 'skate']);
  // The × pressables are the per-chip removers.
  const removers = tree.root
    .findAllByType(Pressable)
    .filter((p) => {
      const child = p.findAllByType(Text)[0];
      return child && child.props.children === '×';
    });
  ReactTestRenderer.act(() => removers[0].props.onPress());
  expect(setTags).toHaveBeenCalledWith(['skate']);
});

test('hides the input once the cap is reached', () => {
  const full = Array.from({ length: MAX_TAGS }, (_, i) => `t${i}`);
  const { tree } = renderInput(full);
  expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
});

test('offers a suggestion and adds it on tap', () => {
  mockSuggestions = [{ id: '1', name: 'surfing', label: 'Surfing' }];
  const { tree, setTags } = renderInput([]);
  // change text to trigger the suggestions render path
  ReactTestRenderer.act(() => tree.root.findByType(TextInput).props.onChangeText('sur'));
  const suggestion = tree.root
    .findAllByType(Pressable)
    .find((p) => p.findAllByType(Text).some((t) => t.props.children?.[1] === 'Surfing'));
  ReactTestRenderer.act(() => suggestion!.props.onPress());
  expect(setTags).toHaveBeenCalledWith(['Surfing']);
});
