// Example file: './constants.ts'

// WARNING: Incorrect usage
// export const ADD = `${prefix}ADD`; // => string
// export const ADD = `${prefix}/ADD`; // => string
// export default {
//   ADD: '@prefix/ADD', // => string
// };

// Correct usage
export const ADD = '@prefix/ADD'; // => '@prefix/ADD'
export const TOGGLE = '@prefix/TOGGLE'; // => '@prefix/TOGGLE'
export default {
  ADD: '@prefix/ADD', // => '@prefix/ADD'
} as const; // working in TS v3.4 and above => https://github.com/Microsoft/TypeScript/pull/29510
