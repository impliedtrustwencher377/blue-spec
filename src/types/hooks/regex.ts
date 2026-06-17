export type RegexSafetyOptions = {
  repetitionLimit: number;
};

export type RegexInput = string | RegExp;

export type RegexVerdict = 'safe' | 'unsafe' | 'invalid regex';

export type QuantifierScan = {
  repetitionCount: number;
  backtrack: boolean;
};

export type RegexScanCursor = {
  source: string;
  position: number;
  repetitionCount: number;
  anchored: boolean;
  backtrack: boolean;
};

export type MemberSet = { members: Set<string>; negated: boolean };

export type CharSet = 'any' | 'none' | MemberSet;

export type ClassFootprint = {
  charSet: CharSet;
  negated: boolean;
};

export type AtomBody = {
  charSet: CharSet;
  endsGreedy: boolean;
  singleChar: boolean;
  permissive: boolean;
  gatedDanger: boolean;
  consumes: boolean;
  loopAmbiguous: boolean;
};

export type AtomScan = {
  charSet: CharSet;
  loops: boolean;
  tailGreedy: boolean;
  permissiveTail: boolean;
  gatedDanger: boolean;
  required: boolean;
};

export type SequenceScan = {
  footprint: CharSet;
  endsGreedy: boolean;
  permissiveTail: boolean;
  unresolvedDanger: boolean;
  required: boolean;
  loopAmbiguous: boolean;
};

export type Alternative = {
  atoms: AtomScan[];
  footprint: CharSet;
  loops: boolean;
  endsGreedy: boolean;
  permissiveTail: boolean;
  required: boolean;
};

export type GateResult = {
  confirmed: boolean;
  unresolved: boolean;
};

export type QuantifierMark = {
  quantified: boolean;
  greedy: boolean;
  unbounded: boolean;
  required: boolean;
};
