import { Query } from '../src/appwrite';

describe('Equal Query', () => {
  test('Normal', () => {
    expect(Query.equal('attribute', 'value')()).toBe('equal("attribute", ["value"])');
  });

  test('Normal + Array', () => {
    expect(Query.equal('attribute', ["value","value2"])()).toBe('equal("attribute", ["value","value2"])');
  });

  test('Minimongo', () => {
    expect(Query.equal('attribute', 'value')(true)).toMatchObject({ attribute: 'value' });
  });

  test('Minimongo + Array', () => {
    expect(Query.equal('attribute', ["value","value2"])(true)).toMatchObject({
      attribute: { $in: ["value","value2"] },
    });
  });
});

describe('Not Equal Query', () => {
  test('Normal', () => {
    expect(Query.notEqual('attribute', 'value')()).toBe('notEqual("attribute", ["value"])');
  });

  test('Normal + Array', () => {
    expect(Query.notEqual('attribute', ["value","value2"])()).toBe('notEqual("attribute", ["value","value2"])');
  });

  test('Minimongo', () => {
    expect(Query.notEqual('attribute', 'value')(true)).toMatchObject({ attribute: { $ne : 'value' } });
  });

  test('Minimongo + Array', () => {
    expect(Query.notEqual('attribute', ["value","value2"])(true)).toMatchObject({
      attribute: { $nin: ["value","value2"] },
    });
  });
});

describe('Less Than Query', () => {
  test('Normal', () => {
    expect(Query.lessThan('attribute', 'value')()).toBe('lessThan("attribute", ["value"])');
  });

  test('Normal + Array', () => {
    expect(Query.lessThan('attribute', ["value","value2"])()).toBe('lessThan("attribute", ["value","value2"])');
  });

  test('Minimongo', () => {
    expect(Query.lessThan('attribute', 'value')(true)).toMatchObject({ attribute: { $lt : 'value' } });
  });

  test('Minimongo + Array', () => {
    expect(Query.lessThan('attribute', ["value","value2"])(true)).toMatchObject({
      attribute: { $nin: ["value","value2"] },
    });
  });
});
