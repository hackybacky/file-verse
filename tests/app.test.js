const request = require('supertest'); // A library to make HTTP requests for testing
const app = require('../src/app'); // Import your app instance

describe('File Upload API', () => {
  it('uploads without a file ', async () => {
    const response = await request(app)
      .post('/upload')
      .send({})
     
    expect(response.status).toBe(400);
    expect(response.text).toBe('No file uploaded.');
  });
  it('uploads a file ', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('uploadFile', './test_data/output.txt')
      .then((res) => {
        expect(res.status).toBe(200)
      
      })
  });
});
