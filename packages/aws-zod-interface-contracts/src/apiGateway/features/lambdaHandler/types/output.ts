import { APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda';

import { GenericApiGatewayContract } from 'apiGateway/ApiGatewayContract';
import { ApiGatewayIntegrationType } from 'apiGateway/constants';
import { OutputType } from 'apiGateway/types';

/**
 * The type of an ApiGateway event. This is the actual event that will
 * be passed to the lambda, not the Swarmion inferred one.
 *
 * See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html.
 */
export type ApiGatewayResult<
  IntegrationType extends ApiGatewayIntegrationType,
  Output,
> = IntegrationType extends 'restApi'
  ? APIGatewayProxyResult
  : APIGatewayProxyResultV2<Output>;

/**
 * The type of output of a Swarmion handler,
 */
export type SwarmionApiGatewayOutput<
  Contract extends GenericApiGatewayContract,
> = OutputType<Contract>;
