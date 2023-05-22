export const log = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log.apply(console, args);
  }
};
