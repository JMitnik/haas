import NodeEnvironment from 'jest-environment-node';
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
    const ctx = singletonDepsModule.graphqlContext;
    const isRun = ctx.isRun();

    process.on('SIGTERM', () => {
      console.log('Got SIGTERM');
    });

    if (!isRun) {
      console.log('i am running now the before call');
      // await ctx.before();
    }
  }

  async teardown() {
    await super.teardown();
    // await ctx.after();
    console.log('TEARDOWN?');
  }
}

module.exports = CustomEnvironment;