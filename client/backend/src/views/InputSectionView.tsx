import React from 'react'

import { useForm } from 'react-hook-form'
import { GridForm } from '../components/UI/GridForm'


import styled, { css } from 'styled-components';
const InputSection = styled.div<{full: Boolean}>`
    display: flex;
    flex-direction: column;
    grid-column-start: ${props => props.full ? 1 : 'auto'};
    grid-column-end: ${props => props.full ? 3 : 'auto'};
`

interface IInputSection {
    title: string;
    sub_title: string;
    full: Boolean;
}

const InputSectionView = (props: IInputSection) => {
    const { register, handleSubmit, watch, errors } = useForm();
    
    return (
        <InputSection full={props.full}>
        <h5>{props.title}</h5>
        <h6>{props.sub_title}</h6>
        <input name="exampleRequired" ref={register({ required: true })} />
        </InputSection>
    )
};

export default InputSectionView;