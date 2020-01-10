import React from 'react'

import { useForm } from 'react-hook-form'
import { Flex } from '../components/UI/Flex'
import { Home, MessageCircle } from 'react-feather';
import { Grid } from '../components/UI/Grid'

import styled, { css } from 'styled-components';
import BasicTopicsForm from './BasicTopicsFormView';
import {TopicBuildContainer } from '../components/UI/TopicBuilderContainer';

const ListItem = styled.li`
    cursor: pointer;
  list-style: none;
  /* padding-left: 1.2em; */
  left: 0;
  margin: 0;
  box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.75);
  padding-bottom: 5px;
  padding-top: 5px;
  font-size: 15px;
  /* margin-bottom: 5px; */
  /* margin-right: 10px; */
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  flex-wrap: nowrap;
  text-overflow: hidden;
  overflow: hidden;
  opacity: 0.9;
  transition: all 0.1s ease-in;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};}
`

const ProgressHeader = styled.h4`
    padding-bottom: 20px;
`

const BasicTopicDetailsView = (props: any) => {
    const { register, handleSubmit, watch, errors } = useForm()
    const onSubmit = (data: any) => { console.log(data) }

    console.log(watch('example')) // watch input value by passing the name of it

    const ProgressContainer = styled.div`
        display: flex;
        flex-direction: column;
        background: #EBEEFF;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `
    const ButtonContainer = styled.div`
        display: flex;
        flex-direction: column;
    `
    return (
        <Grid>
            
            <TopicBuildContainer>
                <BasicTopicsForm></BasicTopicsForm>
                <ProgressContainer>
                    <ProgressHeader>PROGRESS</ProgressHeader>
                    <ul>
                        <ListItem>BASIC TOPIC DETAILS</ListItem>
                        <ListItem>TOPIC CONFIGURATION</ListItem>
                        <ListItem>QUESTIONS AND ANSWERS</ListItem>    
                        <ListItem>AFTER VOTE CONFIGURATION</ListItem>    
                        <ListItem>GREETING MESSAGES</ListItem>
                        <ListItem>LANGUAGES</ListItem>    
                        <ListItem>TOPIC DISTRIBUTION LINKS</ListItem>            
                    </ul>
                    <div>
                        <button>Cancel</button>
                        <button>Publish</button>
                    </div>  
                </ProgressContainer>
            </TopicBuildContainer>
            {/* <BasicTopicsForm/> */}
            {/* <TopicBuildContainer>Hello</TopicBuildContainer> */}
            
        </Grid>
    )
};

export default BasicTopicDetailsView;
