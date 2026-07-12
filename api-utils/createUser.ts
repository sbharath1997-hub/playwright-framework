import { APIRequestContext, expect } from '@playwright/test';
import { Environment } from '../config/environment';
import type { CreateUserRequest, CreateUserResponse } from './userApiTypes';

export default async function createUser(
  request: APIRequestContext
): Promise<CreateUserResponse> {

  const requestBody: CreateUserRequest = {
    name: 'Bharath',
    job: 'SDET'
  };

  const response = await request.post(
    `${Environment.api.jsonPlaceholderBaseUrl}/users`,
    {
      data: requestBody,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  expect(response.status()).toBe(201);

  return await response.json() as CreateUserResponse;
}
