import type {
  APIGatewayEventRequestContextJWTAuthorizer,
  APIGatewayEventRequestContextLambdaAuthorizer,
  APIGatewayEventRequestContextV2WithAuthorizer,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyCallback,
  APIGatewayProxyCallbackV2,
  APIGatewayProxyCognitoAuthorizer,
  APIGatewayProxyEventBase,
  APIGatewayProxyEventV2WithRequestContext,
} from 'aws-lambda';

import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from 'apiGateway/constants';
import { DefinedProperties } from 'types';

export type AuthorizerContext<AuthorizerType extends ApiGatewayAuthorizerType> =
  AuthorizerType extends 'cognito'
    ? APIGatewayProxyCognitoAuthorizer
    : AuthorizerType extends 'jwt'
    ? APIGatewayEventRequestContextJWTAuthorizer
    : AuthorizerType extends 'lambda'
    ? // We use unknown for now because we would need another schema to define the authorizer context
      APIGatewayEventRequestContextLambdaAuthorizer<unknown>
    : undefined;

export type RequestContext<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  CustomRequestContext,
> = (IntegrationType extends 'restApi'
  ? APIGatewayEventRequestContextWithAuthorizer<
      AuthorizerContext<AuthorizerType>
    >
  : APIGatewayEventRequestContextV2WithAuthorizer<
      AuthorizerContext<AuthorizerType>
    >) &
  (CustomRequestContext extends undefined ? unknown : CustomRequestContext);

/**
 * The type of an ApiGateway event. This is the actual event that will
 * be passed to the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayEvent<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
> = IntegrationType extends 'restApi'
  ? APIGatewayProxyEventBase<AuthorizerContext<AuthorizerType>>
  : APIGatewayProxyEventV2WithRequestContext<
      APIGatewayEventRequestContextV2WithAuthorizer<
        AuthorizerContext<AuthorizerType>
      >
    >;

export type HandlerEventType<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  CustomRequestContext,
  Body,
> = DefinedProperties<{
  requestContext: RequestContext<
    IntegrationType,
    AuthorizerType,
    CustomRequestContext
  >;
  pathParameters: PathParameters;
  queryStringParameters: QueryStringParameters;
  headers: Headers;
  body: Body;
}>;

export type HandlerCallback<IntegrationType> = IntegrationType extends 'restApi'
  ? APIGatewayProxyCallback
  : APIGatewayProxyCallbackV2;
