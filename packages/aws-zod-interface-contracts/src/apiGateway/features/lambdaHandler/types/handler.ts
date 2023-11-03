import { Callback, Context } from 'aws-lambda';

import {
  ApiGatewayAuthorizerType,
  ApiGatewayIntegrationType,
} from 'apiGateway/constants';

import { ApiGatewayEvent, HandlerCallback, HandlerEventType } from './input';
import { ApiGatewayResult } from './output';

/**
 * The type of an ApiGateway handler. This is the actual version that will
 * be executed by the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayHandler<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  Output,
  AdditionalArgs extends unknown[] = never[],
> = (
  event: ApiGatewayEvent<IntegrationType, AuthorizerType>,
  context: Context,
  callback: HandlerCallback<IntegrationType>,
  ...additionalArgs: AdditionalArgs
) => Promise<ApiGatewayResult<IntegrationType, Output>>;

/**
 * The **internal** type of a Swarmion handler, with type-inferred event
 * The handler function can define additional arguments.
 *
 * For external use, prefer `SwarmionApiGatewayHandler`
 */
export type InternalSwarmionApiGatewayHandler<
  IntegrationType extends ApiGatewayIntegrationType,
  AuthorizerType extends ApiGatewayAuthorizerType,
  PathParameters,
  QueryStringParameters,
  Headers,
  CustomRequestContext,
  Body,
  Output,
  AdditionalArgs extends unknown[] = never[],
  Event = HandlerEventType<
    IntegrationType,
    AuthorizerType,
    PathParameters,
    QueryStringParameters,
    Headers,
    CustomRequestContext,
    Body
  >,
> = (
  event: Event,
  context: Context,
  callback?: Callback,
  ...additionalArgs: AdditionalArgs
) => Promise<Output>;
