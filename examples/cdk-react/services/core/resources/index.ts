import { App } from 'aws-cdk-lib';

import {
  getAppStage,
  projectName,
  region,
} from '@cdk-react-example/cdk-configuration';


import { CoreStack } from './stack';

const app = new App();

const stage = getAppStage(app);

new CoreStack(app, `${projectName}-core-${stage}`, {
  env: { region },
});
