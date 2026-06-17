import { describe, it, strict } from 'poku';
import { check } from '../../../src/hooks/regex/regex.js';

const expectAll = (verdict: 'safe' | 'unsafe', patterns: string[]): void => {
  for (const pattern of patterns)
    it(`treats ${JSON.stringify(pattern)} as ${verdict}`, () => {
      strict.strictEqual(check(pattern), verdict);
    });
};

describe('check reports plainly safe patterns as safe', () => {
  expectAll('safe', [
    'foobar',
    'a{1,2}',
    '(a|b|c)d?',
    '[a-z0-9]+',
    'a*b*c*',
    '(ab)*',
    '\\(a*\\)*',
    '[(){}]+',
    '',
    'a',
  ]);
});

describe('an ambiguity is safe on its own: catastrophic backtracking needs a failing suffix', () => {
  expectAll('safe', [
    '(a*)*',
    '(a+)+',
    '(a?)*',
    '((a*))*',
    '(a*)+',
    '(a(b(c)*)*)*',
    'a+a+',
    '(a|a)+',
    '(a|ab)+',
    '([a-z]+)*',
  ]);
});

describe('the same ambiguity is unsafe once a required failing element follows it', () => {
  expectAll('unsafe', [
    '(a*)*$',
    '^(a+)+$',
    '(a+)+a',
    '(a*)+b',
    '(x+x+)+y',
    '([a-z]+)*$',
    'a+a+b',
    '.*.*=.*',
    '\\w+\\d+x',
    '(a|a)+$',
    '(a|ab)+$',
    '(\\w|\\d)+!',
  ]);
});

describe('an unanchored greedy run before a trailing anchor is unsafe', () => {
  expectAll('unsafe', [
    'boundary=(.+)$',
    '(.+)$',
    '(.*)$',
    'x.+$',
    '[a-z]+$',
    '(\\w+)$',
    '(a.+)$',
    '(.+|x)$',
  ]);
});

describe('a greedy run before an anchor is safe when anchored, narrow, or lazy', () => {
  expectAll('safe', [
    '^(.+)$',
    '^.+$',
    '(.+?)$',
    '(a+abc)$',
    '([0-9]+x)$',
    '(abc)+$',
  ]);
});

describe('an unanchored permissive greedy scan before required input is unsafe', () => {
  expectAll('unsafe', [
    'filename="([^"]*)"',
    'Content-Type:\\s*([^\\r\\n]+)',
    '([^"]*)"',
    '"([^"]*)"',
    '<([^>]+)>',
    '(.*)x',
    '(.+abc)$',
    '.+.+',
  ]);
});

describe('a permissive greedy run is safe when anchored, narrow, or unfollowed', () => {
  expectAll('safe', [
    '^filename="([^"]*)"',
    '^(.*)x',
    '(a*)b',
    '\\d*;',
    '[abc]*x',
    '([^"]*)',
    '[^\\r\\n]+',
  ]);
});

describe('adjacent and alternation overlap is judged by real character overlap', () => {
  expectAll('unsafe', ['\\d+[0-9]+x', '([a-d]|[b-f])+$', '([a-d]|[c-f])c*$']);

  expectAll('safe', [
    '[0-9]+[a-z]+x',
    '\\d+\\.\\d+',
    'a+b+',
    '([a-c]|[d-f])+$',
    '([a]|[^a])+$',
    '^[^\\d]+[0-9]*$',
    '^[^\\w]+a*$',
  ]);
});

describe('a quantifier inside a lookaround does not drive the outer match', () => {
  expectAll('safe', [
    '^a(?=a+a+)$',
    '^a(?!a+a+)$',
    '^a(?<=a+a+)$',
    '^a(?<!a+a+)$',
    '^a+(?=a+a+)$',
  ]);
});

describe('check enforces the repetition limit', () => {
  it('keeps repetitions at the default limit safe', () => {
    strict.strictEqual(check('a?'.repeat(25)), 'safe');
  });

  it('reports repetitions above the default limit as unsafe', () => {
    strict.strictEqual(check('a?'.repeat(26)), 'unsafe');
  });

  it('honors a custom, stricter limit', () => {
    strict.strictEqual(check('a?a?a?', { repetitionLimit: 2 }), 'unsafe');
    strict.strictEqual(check('a?a?a?', { repetitionLimit: 3 }), 'safe');
  });
});

describe('check reads RegExp and string input the same way', () => {
  it('reports a vulnerable RegExp object as unsafe', () => {
    strict.strictEqual(check(/(a+)+$/), 'unsafe');
  });

  it('reports a safe RegExp object as safe', () => {
    strict.strictEqual(check(/[a-z0-9]+/i), 'safe');
  });

  it('reads a RegExp by its source, ignoring flags', () => {
    strict.strictEqual(check(/(a+)+$/g), check('(a+)+$'));
  });
});

describe('check reports patterns that are not valid regexes as invalid regex', () => {
  const invalid = ['a)b', '(abc', '*abc', '[abc', 'a{2,1}', '\\'];

  for (const pattern of invalid) {
    it(`reports ${JSON.stringify(pattern)} as invalid regex`, () => {
      strict.strictEqual(check(pattern), 'invalid regex');
    });
  }
});
