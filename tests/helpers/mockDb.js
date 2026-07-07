const mockQuery = jest.fn();
const mockConnect = jest.fn();

const mockClient = {
  query: mockQuery,
  release: jest.fn(),
};

mockConnect.mockResolvedValue(mockClient);

const mockPool = {
  connect: mockConnect,
  query: mockQuery,
  on: jest.fn(),
};

const mockDb = {
  query: mockQuery,
  pool: mockPool,
  testConnection: jest.fn().mockResolvedValue({ now: new Date() }),
};

module.exports = { mockDb, mockQuery, mockClient, mockPool };
