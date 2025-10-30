import request from 'supertest';
import express, { Express } from 'express';
import { healthCheck } from '../controllers/health/healthCheck';

describe('Health Check Endpoint', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.get('/health', healthCheck);
  });

  it('should return 200 status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('memory');
  });

  it('should return correct structure', async () => {
    const response = await request(app).get('/health');

    expect(response.body.status).toBe('OK');
    expect(response.body.memory).toHaveProperty('used');
    expect(response.body.memory).toHaveProperty('total');
    expect(response.body.memory).toHaveProperty('unit');
    expect(response.body.memory.unit).toBe('MB');
  });
});
