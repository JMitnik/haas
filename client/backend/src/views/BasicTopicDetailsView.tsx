import React from 'react'

import { useForm } from 'react-hook-form'
import { Flex } from '../components/UI/Flex'
import { Home, MessageCircle } from 'react-feather';
import { Grid } from '../components/UI/Grid'

import styled, { css } from 'styled-components';
import BasicTopicsForm from './BasicTopicsFormView'


export const MiniHeader = styled.h4`
  ${({ theme }) => css`
    grid-column-start: 1;
    grid-column-end: 3;
    padding-bottom: 5px;
    `
    }`;

const BasicTopicDetailsView = (props: any) => {
    const { register, handleSubmit, watch, errors } = useForm()
    const onSubmit = (data: any) => { console.log(data) }

    console.log(watch('example')) // watch input value by passing the name of it

    return (
        <Grid>
            <MiniHeader>BASIC TOPIC DETAILS</MiniHeader>
            <BasicTopicsForm></BasicTopicsForm>
        </Grid>
    )
};

export default BasicTopicDetailsView;
