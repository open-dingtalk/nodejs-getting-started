module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures','<rootDir>/website'],
  coveragePathIgnorePatterns: ['<rootDir>/test/','<rootDir>/website'],
};