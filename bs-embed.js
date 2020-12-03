module.exports = {
  rewriteRules: [
    {
      match: /https:\/\/actonmass-rep-map.netlify.app/g,
      fn: () => 'http://localhost:3000',
    },
  ],
};
