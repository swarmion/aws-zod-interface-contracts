import { generateSchema } from '@anatine/zod-openapi';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { OpenAPIV3 } from 'openapi-types';

import { GenericApiGatewayContract } from 'apiGateway/ApiGatewayContract';
import { ContractOpenApiDocumentation } from 'types/contractOpenApiDocumentation';

export const getContractDocumentation = <
  Contract extends GenericApiGatewayContract,
>(
  contract: Contract,
): ContractOpenApiDocumentation => {
  const initialDocumentation: OpenAPIV3.OperationObject = {
    responses: {},
  };

  const definedOutputSchema = omitBy(contract.outputSchemas, isUndefined);
  console.log(definedOutputSchema);

  // add responses to the object
  const contractDocumentation = Object.keys(definedOutputSchema).reduce(
    (config: OpenAPIV3.OperationObject, responseCode) => {
      const schema = definedOutputSchema[responseCode];

      if (schema === undefined) {
        return config;
      }

      const openApiSchema = generateSchema(schema);

      return {
        ...config,
        responses: {
          ...config.responses,
          [responseCode]: {
            description: `Response: ${responseCode}`,
            content: {
              'application/json': {
                schema: openApiSchema as OpenAPIV3.SchemaObject,
              },
            },
          },
        },
      };
    },
    initialDocumentation,
  );

  if (contract.pathParametersSchema !== undefined) {
    contractDocumentation.parameters = [
      ...Object.entries(contract.pathParametersSchema.shape).map(
        ([variableName, variableDefinition]) => ({
          name: variableName,
          in: 'path',
          schema: generateSchema(variableDefinition) as OpenAPIV3.SchemaObject,
          required: !variableDefinition.isOptional(),
        }),
      ),
      ...(contractDocumentation.parameters ?? []),
    ];
  }

  if (contract.queryStringParametersSchema !== undefined) {
    contractDocumentation.parameters = [
      ...Object.entries(contract.queryStringParametersSchema.shape).map(
        ([variableName, variableDefinition]) => ({
          name: variableName,
          in: 'query',
          schema: generateSchema(variableDefinition) as OpenAPIV3.SchemaObject,
          required: !variableDefinition.isOptional(),
        }),
      ),
      ...(contractDocumentation.parameters ?? []),
    ];
  }

  if (contract.headersSchema !== undefined) {
    contractDocumentation.parameters = [
      ...Object.entries(contract.headersSchema.shape).map(
        ([variableName, variableDefinition]) => ({
          name: variableName,
          in: 'header',
          schema: generateSchema(variableDefinition) as OpenAPIV3.SchemaObject,
          required: !variableDefinition.isOptional(),
        }),
      ),
      ...(contractDocumentation.parameters ?? []),
    ];
  }

  if (contract.bodySchema !== undefined) {
    contractDocumentation.requestBody = {
      content: {
        'application/json': {
          schema: generateSchema(contract.bodySchema) as OpenAPIV3.SchemaObject,
        },
      },
    };
  }

  return {
    path: contract.path,
    method: contract.method.toLowerCase(),
    documentation: contractDocumentation,
  };
};
