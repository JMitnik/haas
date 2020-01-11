import React from 'react'

import { Grid } from '../components/UI/Grid'

import styled from 'styled-components';
import BasicTopicsForm from './BasicTopicsFormView';
import { NavLink } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import QNATopicsForm from './QNATopicsFormView'

const ListItem = styled.li`
  cursor: pointer;
  list-style: none;
  left: 0;
  margin: 0;
  box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.75);
  padding-bottom: 15px;
  padding-top: 15px;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  text-overflow: hidden;
  overflow: hidden;
  opacity: 0.9;
  transition: all 0.1s ease-in;
  background-color: #F5F6F8;
  &:hover {
    background-color: ${({ theme }) => theme.defaultColors.alt};
    color: ${({ theme }) => theme.colors.white};};
`

const ProgressHeader = styled.h4`
    padding-bottom: 20px;
`

const ProgressContainer = styled.div`
        display: flex;
        flex-direction: column;
        background: #EBEEFF;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `
    
const ButtonContainer = styled.div`
        display: flex;
        justify-content: space-around;
        padding-top: 10%;
    `

const TopicBuildContainer = styled.div`
    display: grid;
    grid-template-columns: 80% 20%;
    grid-column-gap: 10px;   
` 

const BasicTopicDetailsView = () => {
    return (
        <Grid>
            <TopicBuildContainer>
            <Switch>
                <Route path="/topic-builder/questions-and-answers" render={() => <QNATopicsForm />} />
                <Route path="/topic-builder/" render={() => <BasicTopicsForm/>} />
            </Switch>
                <ProgressContainer>
                    <ProgressHeader>PROGRESS</ProgressHeader>
                    <ul>
                        <ListItem>
                            <NavLink to="/topic-builder">BASIC TOPIC DETAILS</NavLink>
                            </ListItem>
                        <ListItem>TOPIC CONFIGURATION</ListItem>
                        <ListItem>
                            <NavLink to="/topic-builder/questions-and-answers">QUESTIONS AND ANSWERS</NavLink>
                        </ListItem>    
                        <ListItem>AFTER VOTE CONFIGURATION</ListItem>    
                        <ListItem>GREETING MESSAGES</ListItem>
                        <ListItem>LANGUAGES</ListItem>    
                        <ListItem>TOPIC DISTRIBUTION LINKS</ListItem>            
                    </ul>
                    <ButtonContainer>
                        <button>Cancel</button>
                        <button>Publish</button>
                    </ButtonContainer>  
                </ProgressContainer>
            </TopicBuildContainer>
            {/* <BasicTopicsForm/> */}
            {/* <TopicBuildContainer>Hello</TopicBuildContainer> */}
            
        </Grid>
    )
};

export default BasicTopicDetailsView;
