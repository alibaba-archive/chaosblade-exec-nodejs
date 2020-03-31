export const THROW_CUSTOM_EXCEPTION = 'throwCustomException';
export const STANDARD_ERROR_TYPE = new Map([
  ['Error', Error],
  ['EvalError', EvalError],
  ['SyntaxError', SyntaxError],
  ['RangeError', RangeError],
  ['ReferenceError', ReferenceError],
  ['TypeError', TypeError],
  ['URIError', URIError]
]);