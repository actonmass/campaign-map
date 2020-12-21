module.exports = {
  watch: true,
  rewriteRules: [
    {
      match: /https:\/\/actonmass.github.io\/campaign-map/g,
      fn: () => 'http://localhost:3000',
    },
  ],
};
