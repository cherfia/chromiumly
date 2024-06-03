const configMock = {
  get: jest.fn(() => {
    return "http://localhost:3000";
  }),
  has: jest.fn(() => {
    return true;
  }),
};

export default configMock;
