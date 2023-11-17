import axios from 'axios';
import { z } from 'zod';

import { HttpStatusCodes } from 'types/http';

import { ApiGatewayContract } from '../../ApiGatewayContract';
import { getAxiosRequest } from './axiosRequest';

describe('apiGateway axios request', () => {
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

  describe('httpApi, when all parameters are set', () => {
    const httpApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/users/{userId}',
      method: 'GET',
      integrationType: 'httpApi',
      pathParametersSchema,
      queryStringParametersSchema,
      headersSchema,
      bodySchema,
      outputSchemas: {
        [HttpStatusCodes.OK]: outputSchema,
      },
    });

    it('should have the correct axiosRequest', async () => {
      await expect(() =>
        getAxiosRequest(
          httpApiContract,
          axios.create({ baseURL: 'http://blob.test' }),
          {
            pathParameters: {
              userId: 'azer',
              pageNumber: 'zert',
            },
            queryStringParameters: {
              testId: 'erty',
            },
            headers: {
              myHeader: 'rtyu',
            },
            body: {
              foo: 'tyui',
              bar: ['yuio'],
            },
          },
        ),
      ).rejects.toMatchObject({
        config: {
          url: '/users/azer',
          data: '{"foo":"tyui","bar":["yuio"]}',
          params: { testId: 'erty' },
        },
      });
    });
  });

  describe('restApi, when it is instantiated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: '/coucou',
      method: 'POST',
      integrationType: 'httpApi',
    });

    it('should have the correct axios request ', async () => {
      await expect(() =>
        getAxiosRequest(
          restApiContract,
          axios.create({ baseURL: 'http://blob.test' }),
          {},
        ),
      ).rejects.toMatchObject({
        config: {
          url: '/coucou',
        },
      });
    });
  });
});
