import { O } from 'ts-toolbelt';
import { z } from 'zod';

import {
  ConstrainedJsonZodSchema,
  DefinedProperties,
  JsonZodSchema,
} from 'types';
import { HttpMethod } from 'types/http';

import { GenericApiGatewayContract } from './ApiGatewayContract';

export type PathParametersType<Contract extends GenericApiGatewayContract> =
  Contract['pathParametersSchema'] extends ConstrainedJsonZodSchema
    ? z.infer<Contract['pathParametersSchema']>
    : undefined;

export type QueryStringParametersType<
  Contract extends GenericApiGatewayContract,
> = Contract['queryStringParametersSchema'] extends ConstrainedJsonZodSchema
  ? z.infer<Contract['queryStringParametersSchema']>
  : undefined;

export type HeadersType<Contract extends GenericApiGatewayContract> =
  Contract['headersSchema'] extends ConstrainedJsonZodSchema
    ? z.infer<Contract['headersSchema']>
    : undefined;

export type CustomRequestContextType<
  Contract extends GenericApiGatewayContract,
> = Contract['requestContextSchema'] extends JsonZodSchema
  ? z.infer<Contract['requestContextSchema']>
  : undefined;

export type BodyType<Contract extends GenericApiGatewayContract> =
  Contract['bodySchema'] extends JsonZodSchema
    ? z.infer<Contract['bodySchema']>
    : undefined;

export type OutputsType<Contract extends GenericApiGatewayContract> = {
  [StatusCode in keyof Contract['outputSchemas']]: {
    statusCode: StatusCode;
    body: Contract['outputSchemas'][StatusCode] extends JsonZodSchema
      ? z.infer<Contract['outputSchemas'][StatusCode]>
      : void;
  };
};

export type OutputType<Contract extends GenericApiGatewayContract> = O.UnionOf<
  OutputsType<Contract>
>;

/**
 * Computed request parameters. This enables the call to the contract to be type-safe
 */
export interface RequestParameters<RequestBodyType> {
  method: HttpMethod;
  path: string;
  body?: RequestBodyType;
  headers?: Record<string, string>;
  queryStringParameters?: Record<string, string>;
}

export type RequestArguments<Contract extends GenericApiGatewayContract> =
  DefinedProperties<{
    pathParameters: PathParametersType<Contract>;
    queryStringParameters: QueryStringParametersType<Contract>;
    headers: HeadersType<Contract>;
    body: BodyType<Contract>;
  }>;
