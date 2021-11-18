type NodeEnv = 'test' | 'development' | 'production';

export const getNodeEnv = (): NodeEnv => import.meta.env.NODE_ENV as NodeEnv;
