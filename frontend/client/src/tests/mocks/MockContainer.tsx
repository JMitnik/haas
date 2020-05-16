import React from "react";
import ApolloMockProvider from "./ApolloMockProvider";
import { MemoryRouter } from "react-router-dom";
import { ProjectProvider } from "providers/ProjectProvider";
import { DialogueTreeProvider } from "providers/DialogueTreeProvider";

const MockContainer = ({ baseUrl, children }: { baseUrl?: string, children?: React.ReactNode }) => {
    return (
        <ApolloMockProvider>
            <MemoryRouter initialEntries={[baseUrl || '']}>
                <ProjectProvider>
                    <DialogueTreeProvider>
                        {children}
                    </DialogueTreeProvider>
                </ProjectProvider>
            </MemoryRouter>
        </ApolloMockProvider>
    );
};

export default MockContainer;
