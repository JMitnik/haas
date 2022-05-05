const NodeEnvironment = require('jest-environment-node').default;
import * as singletonDepsModule from './singletonDeps';

export class CustomEnvironment extends NodeEnvironment {
  constructor(config: any, context: any) {
    super(config, context);
  }

  async setup() {
    // await super.setup();
    this.global.singletonDepsModule = singletonDepsModule;
    // @ts-ignore
    this.globalThis = { singletonDepsModule };

    console.log('HMMM, AM I BEING RUN THEN TWICE OR MORE????')
  }

  async teardown() {
    await super.teardown();

  }
}

module.exports = CustomEnvironment;