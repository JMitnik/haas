import React, { useRef } from 'react'
import styled from 'styled-components/macro';
import useOnClickOutside from 'hooks/useClickOnOutside';
import { useLocation, useHistory } from 'react-router';

const ModalOverlayContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 100;
`;

const ModalInnerContainer = styled.div`
    position: absolute;
    top: 50%;
    z-index: 200;
    background: white;
    width: 600px;
    padding: 24px;
    left: 50%;
    border-radius: 20px;
    transform: translate(-50%, -50%);
`;

const Modal = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<any>();
    const history = useHistory();
    const location = useLocation<any>();

    const closeModal = () => {
        console.log("Should close");

        history.push(location.pathname, {})
    }

    useOnClickOutside(ref, () => closeModal());

    return (
        <ModalOverlayContainer>
            <ModalInnerContainer ref={ref}>
                {children}
            </ModalInnerContainer>
        </ModalOverlayContainer>
    )
}

export default Modal;
