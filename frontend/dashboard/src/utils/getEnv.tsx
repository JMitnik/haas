type NodeEnv = 'test' | 'development' | 'production';

export const getNodeEnv = (): NodeEnv => process.env.NODE_ENV as NodeEnv;
