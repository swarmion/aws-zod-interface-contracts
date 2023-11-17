import { z } from 'zod';

import { ApiGatewayContract } from 'apiGateway/ApiGatewayContract';
import { HttpStatusCodes } from 'types/http';

import { getContractDocumentation } from './openApiDocumentation';

describe('apiGateway openApi contract documentation', () => {
  const pathParametersSchema = z.object({
    userId: z.string(),
    pageNumber: z.string(),
  });

  const queryStringParametersSchema = z.object({
    testId: z.string(),
  });

  const headersSchema = z.object({
    myHeader: z.string(),
  });

  const bodySchema = z.object({
    foo: z.string(),
  });

  const outputSchema = z.object({
    id: z.string(),
    name: z.string(),
  });

  const unauthorizedSchema = z.object({
    message: z.string(),
  });

  const outputSchemas = {
    [HttpStatusCodes.OK]: outputSchema,
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedSchema,
  };

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
      outputSchemas,
    });

    it('should generate open api documentation', () => {
      expect(getContractDocumentation(httpApiContract)).toEqual({
        path: '/users/{userId}',
        method: 'get',
        documentation: {
          parameters: [
            {
              in: 'header',
              name: 'myHeader',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              in: 'query',
              name: 'testId',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'userId',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              in: 'path',
              name: 'pageNumber',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    foo: {
                      type: 'string',
                    },
                  },
                  required: ['foo'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Response: 200',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                    required: ['id', 'name'],
                  },
                },
              },
            },
            '401': {
              description: 'Response: 401',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                      },
                    },
                    required: ['message'],
                  },
                },
              },
            },
          },
        },
      });
    });
  });

  describe('restApi, when it is instanciated with a subset of schemas', () => {
    const restApiContract = new ApiGatewayContract({
      id: 'testContract',
      path: 'coucou',
      method: 'POST',
      integrationType: 'restApi',
    });

    it('should generate open api documentation', () => {
      expect(getContractDocumentation(restApiContract)).toEqual({
        path: 'coucou',
        method: 'post',
        documentation: {
          responses: {}, // no response is configured
        },
      });
    });
  });
});
