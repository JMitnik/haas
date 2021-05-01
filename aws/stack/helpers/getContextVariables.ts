import { ContextType } from "../types/main";
import * as core from '@aws-cdk/core';

export const getStageContextValues = (app: core.Construct, stage: string): ContextType => {
    const contextValues = app.node.tryGetContext(stage);

    if (!contextValues) {
        throw new Error(`Cant find context values for stage: ${stage}`);
    }

    return contextValues as ContextType;
}