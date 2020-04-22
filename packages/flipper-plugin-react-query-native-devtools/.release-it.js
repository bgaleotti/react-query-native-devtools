module.exports = {
  git: {
    commitMessage: 'chore: release v${version}',
    push: false,
    requireUpstream: false,
    tagName: 'v${version}',
  },
  npm: {
    publish: false,
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      preset: 'angular',
    },
  },
};
