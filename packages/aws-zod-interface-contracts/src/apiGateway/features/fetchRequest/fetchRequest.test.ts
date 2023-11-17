/* eslint-disable max-lines */
/// <reference lib="dom" />

import { z } from 'zod';

import { HttpStatusCodes } from 'types/http';

import { ApiGatewayContract } from '../../ApiGatewayContract';
import { getFetchRequest } from './fetchRequest';

const mockedFetch = vi.fn(() =>
  Promise.resolve({
    json: () => {
      return Promise.resolve(undefined);
    },
  }),
);

describe('apiGateway fetch request', () => {
  const pathParametersSchema = z.object({
    userId: z.string(),
    pageNumber: z.string(),
  });

  const queryStringParametersSchema = z.object({
    testId: z.string(),
    optionalParam: z.string().optional(),
  });

  const headersSchema = z.object({
    myHeader: z.string(),
  });

  const bodySchema = z.object({
    foo: z.string(),
    bar: z.array(z.string()).optional(),
  });

  const outputSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  describe('restApi, when all parameters are set', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'POST',
      integrationType: 'httpApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchemas: {
        [HttpStatusCodes.OK]: outputSchema,
      },
    });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should have the correct axiosRequest when all values are defined', async () => {
      await getFetchRequest(
        httpApiContract,
        mockedFetch as unknown as typeof fetch,
        {
          pathParameters: {
            userId: 'azer',
            pageNumber: 'zert',
          },
          queryStringParameters: {
            testId: 'er',
            optionalParam: 'ty',
          },
          headers: {
            myHeader: 'rtyu',
          },
          body: {
            foo: 'tyui',
            bar: ['yuio'],
          },
          baseUrl: 'http://localhost:3000',
        },
      );
      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/users/azer?testId=er&optionalParam=ty'),
        {
          body: '{"foo":"tyui","bar":["yuio"]}',
          headers: { myHeader: 'rtyu', 'Content-Type': 'application/json' },
          method: 'POST',
        },
      );
    });

    it('should have the correct axiosRequest when some queryStringParameters are undefined', async () => {
      await getFetchRequest(
        httpApiContract,
        mockedFetch as unknown as typeof fetch,
        {
          pathParameters: {
            userId: 'azer',
            pageNumber: 'zert',
          },
          queryStringParameters: {
            testId: 'erty',
            optionalParam: undefined,
          },
          headers: {
            myHeader: 'rtyu',
          },
          body: {
            foo: 'tyui',
            bar: ['yuio'],
          },
          baseUrl: 'http://localhost:3000',
        },
      );
      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/users/azer?testId=erty'),
        {
          body: '{"foo":"tyui","bar":["yuio"]}',
          headers: { myHeader: 'rtyu', 'Content-Type': 'application/json' },
          method: 'POST',
        },
      );
    });
  });

  describe('httpApi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'GET',
      integrationType: 'httpApi',
    });

    it('should have the correct axios request ', async () => {
      await getFetchRequest(
        restApiContract,
        mockedFetch as unknown as typeof fetch,
        { baseUrl: 'http://localhost:3000' },
      );
      expect(mockedFetch).toHaveBeenCalledWith(
        new URL('http://localhost:3000/coucou'),
        {
          body: undefined,
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
        },
      );
    });
  });

  describe('httpApi without base url', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'GET',
      integrationType: 'httpApi',
      queryStringParametersSchema,
    });

    it('should have the correct axios request ', async () => {
      await getFetchRequest(
        httpApiContract,
        mockedFetch as unknown as typeof fetch,
        {
          queryStringParameters: {
            testId: 'erty',
          },
        },
      );
      expect(mockedFetch).toHaveBeenCalledWith('/coucou?testId=erty', {
        body: undefined,
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
    });
  });
});
