module.exports = {
  watch: true,
  rewriteRules: [
    {
      match: /https:\/\/actonmass-rep-map.netlify.app/g,
      fn: () => 'http://localhost:3000',
    },
  ],
};
