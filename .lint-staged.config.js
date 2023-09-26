module.exports = {
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': ['prettier --write'],
  '*.+(js|jsx|ts|tsx|vue)': ['eslint --fix']
};
