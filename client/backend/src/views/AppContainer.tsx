import React, { ReactChild } from 'react';
import { Button } from '../components/UI/Buttons';
import A
const AppContainer = ({ children, ...props }: { children: ReactChild }) => {
    return (
        <div>
            <Button>Click here</Button>
        </div>
    )
}

export default AppContainer;
