import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { z } from 'zod';

import {
  ConstrainedJsonZodSchema,
  HttpMethod,
  HttpStatusCodes,
  JsonZodSchema,
} from 'types';

import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from './constants';

/**
 * ApiGatewayContract:
 *
 * a contract used to define a type-safe interaction between AWS Services through Api Gateway.
 *
 * Main features:
 * - input and output dynamic validation with zod on both end of the contract;
 * - type inference for both input and output;
 * - generation of a contract document that can be checked for breaking changes;
 * - generation of open api documentation
 */
export class ApiGatewayContract<
  Path extends string = string,
  Method extends HttpMethod = HttpMethod,
  IntegrationType extends ApiGatewayIntegrationType = ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType = undefined,
  PathParametersSchema extends ConstrainedJsonZodSchema | undefined = undefined,
  QueryStringParametersSchema extends ConstrainedJsonZodSchema | undefined =
    | undefined,
  HeadersSchema extends ConstrainedJsonZodSchema | undefined = undefined,
  RequestContextSchema extends JsonZodSchema | undefined = undefined,
  BodySchema extends JsonZodSchema | undefined = undefined,
  PropsOutputSchemas extends
    | Partial<Record<HttpStatusCodes, JsonZodSchema>>
    | undefined = undefined,
  OutputSchemas = Exclude<PropsOutputSchemas, undefined>,
> {
  public id: string;
  public path: Path;
  public method: Method;
  public integrationType: IntegrationType;
  public authorizerType: AuthorizerType;
  public pathParametersSchema: PathParametersSchema;
  public queryStringParametersSchema: QueryStringParametersSchema;
  public headersSchema: HeadersSchema;
  public requestContextSchema: RequestContextSchema;
  public bodySchema: BodySchema;
  public outputSchemas: OutputSchemas;
  public inputSchema: JsonZodSchema;

  /**
   * Builds a new ApiGateway contract
   *
   * @param props - the contract properties
   */
  constructor(props: {
    /**
     * An id to uniquely identify the contract among services. Beware of uniqueness!
     */
    id: string;
    /**
     * The path on which the lambda will be triggered
     */
    path: Path;
    /**
     * The http method
     */
    method: Method;
    /**
     * `'httpApi'` or `'restApi'`, see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html
     */
    integrationType: IntegrationType;
    /**
     * Indicates which type of authorizer is used for this contract.
     */
    authorizerType?: AuthorizerType;
    /**
     * A JSONSchema used to validate the path parameters and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    pathParametersSchema?: PathParametersSchema;
    /**
     * A JSONSchema used to validate the query parameters and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    queryStringParametersSchema?: QueryStringParametersSchema;
    /**
     * A JSONSchema used to validate the headers and infer their types.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    headersSchema?: HeadersSchema;
    /**
     * A JSONSchema used to validate the requestContext and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    requestContextSchema?: RequestContextSchema;
    /**
     * A JSONSchema used to validate the body and infer its type.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    bodySchema?: BodySchema;
    /**
     * A record of JSONSchemas used to validate different outputs and infer their types depending on the return status code.
     *
     * Please note that the `as const` directive is necessary to properly infer the type from the schema.
     * See https://github.com/ThomasAribart/json-schema-to-ts#fromschema.
     */
    outputSchemas?: PropsOutputSchemas;
  }) {
    this.id = props.id;
    this.path = props.path;
    this.method = props.method;
    this.integrationType = props.integrationType;
    this.authorizerType = (props.authorizerType ?? undefined) as AuthorizerType;
    this.pathParametersSchema = (props.pathParametersSchema ??
      undefined) as PathParametersSchema;
    this.queryStringParametersSchema = (props.queryStringParametersSchema ??
      undefined) as QueryStringParametersSchema;
    this.headersSchema = (props.headersSchema ?? undefined) as HeadersSchema;
    this.requestContextSchema = (props.requestContextSchema ??
      undefined) as RequestContextSchema;
    this.bodySchema = (props.bodySchema ?? undefined) as BodySchema;
    this.outputSchemas = (
      props.outputSchemas !== undefined ? props.outputSchemas : {}
    ) as OutputSchemas;
    this.inputSchema = this.getInputSchema();
  }

  private getInputSchema(): JsonZodSchema {
    const properties = omitBy(
      {
        pathParameters: this.pathParametersSchema,
        queryStringParameters: this.queryStringParametersSchema,
        headers: this.headersSchema,
        requestContext: this.requestContextSchema,
        body: this.bodySchema,
      } as const,
      isUndefined,
    ) as Record<string, JsonZodSchema>;

    return z.object(properties);
  }
}

/**
 * The type of an ApiGateway contract using all default types.
 *
 * It is used internally to type contract features input
 */
export type GenericApiGatewayContract = ApiGatewayContract<
  string,
  HttpMethod,
  ApiGatewayIntegrationType,
  ApiGatewayAuthorizerType,
  ConstrainedJsonZodSchema | undefined,
  ConstrainedJsonZodSchema | undefined,
  ConstrainedJsonZodSchema | undefined,
  JsonZodSchema | undefined,
  JsonZodSchema | undefined,
  Partial<Record<HttpStatusCodes, JsonZodSchema>>
>;
