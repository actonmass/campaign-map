module.exports = {
  watch: true,
  rewriteRules: [
    {
      match: /https:\/\/bhrutledge.com\/actonmass-campaign-map/g,
      fn: () => 'http://localhost:3000',
    },
  ],
};
