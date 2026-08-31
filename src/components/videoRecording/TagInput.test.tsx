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

const { TagInput, MAX_TAGS, commitPendingTag } = require('./TagInput');

/**
 * The draft is a controlled prop now (the posting screen owns it so publishing
 * can commit a half-typed tag), so the harness has to play that part.
 */
function renderInput(initial: string[] = []) {
  const tags = initial;
  let draft = '';
  const setTags = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  const render = () =>
    React.createElement(TagInput, {
      tags,
      setTags,
      draft,
      setDraft: (next: string) => {
        draft = next;
        ReactTestRenderer.act(() => tree.update(render()));
      },
    });
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(render());
  });
  return { tree, setTags };
}

const submit = (tree: ReactTestRenderer.ReactTestRenderer, value: string) => {
  const input = tree.root.findByType(TextInput);
  ReactTestRenderer.act(() => input.props.onChangeText(value));
  ReactTestRenderer.act(() => tree.root.findByType(TextInput).props.onSubmitEditing());
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
  expect(setTags).toHaveBeenCalledWith([]);
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

describe('commitPendingTag — the tag left in the field at publish time', () => {
  test('adds the half-typed tag', () => {
    expect(commitPendingTag(['surf'], 'festival')).toEqual(['surf', 'festival']);
  });

  test('normalizes it the same way a confirmed tag is normalized', () => {
    expect(commitPendingTag([], '  Big   Wave ')).toEqual(['Big Wave']);
  });

  test('leaves the list alone for a blank, a duplicate, or a full list', () => {
    expect(commitPendingTag(['surf'], '  ')).toEqual(['surf']);
    expect(commitPendingTag(['Surf'], 'surf')).toEqual(['Surf']);
    const full = Array.from({ length: MAX_TAGS }, (_, i) => `t${i}`);
    expect(commitPendingTag(full, 'extra')).toEqual(full);
  });
});
