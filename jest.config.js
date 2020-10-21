module.exports = {
  modulePaths: ['<rootDir>/src/'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^<rootDir>/(.*)$': '<rootDir>/$1', // allows to use <rootDir> inside tests
  },
};
