export const unreachable = (message: never) => {
  throw new Error(`Hit unreachable case: ${message}`);
};
