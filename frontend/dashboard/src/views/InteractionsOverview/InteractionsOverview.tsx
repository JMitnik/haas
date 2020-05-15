import React, { useState } from 'react';

import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import { DownloadCloud, Search, Calendar } from 'react-feather'
import {
    Container, Flex, Grid, H2, H3, Muted, Button,
    Div, StyledLabel, StyledInput, Hr, FormGroupContainer, Form
} from '@haas/ui';

import { InteractionsOverviewContainer, InputOutputContainer, OutputContainer, InputContainer } from './InteractionOverviewStyles';

const InteractionsOverview = () => {
    const { topicId } = useParams();

    // const { loading, data } = useQuery(getQuestionnaireData, {
    //     variables: { 
    //       dialogueId: topicId,
    //     },
    //   });

    return (
        <Div px="24px" margin="0 auto" width="100vh" height="100vh" maxHeight="100vh" overflow="hidden">
            <H2 color="#3e3d5a" fontWeight={400} mb="10%"> Interactions </H2>
            <InputOutputContainer mb="5%">
                <OutputContainer>
                    <Div justifyContent="center">Export</Div>
                    <Button marginLeft="10%" padding="5px 12px">
                        <Div marginRight="20%">PDF</Div>
                        <DownloadCloud />
                    </Button>
                </OutputContainer>
                <InputContainer>
                    <Button marginRight="10%" padding="5px 12px">
                        <Div marginRight="20%">ALL</Div>
                        <Calendar />
                    </Button>
                    <Button padding="5px 12px">
                        <Div marginRight="20%">SEARCH</Div>
                        <Search />
                    </Button>
                </InputContainer>
            </InputOutputContainer>
            <Div style={{border: "1px solid"}} mb="1%" height="70%">Table here</Div>
            <Div justifyContent="center">Pagination here</Div>
        </Div>
    )
}

export default InteractionsOverview;
