import React from 'react';

import styled from 'styled-components';
import { NavLink, Switch, Route } from 'react-router-dom';

import BasicTopicsTopicForm from './Forms/BasicTopicsTopicForm';
import { Div } from '../../../components/UI/Generics';
import { Flex, Grid } from '../../../components/UI/Container';
import Button from '../../../components/UI/Buttons';
import QuestionsForm from './Forms/QuestionsForm';

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
    background-color: ${({ theme }) => theme.colors.default.alt};
    color: ${({ theme }) => theme.colors.white};};
`;

const ProgressContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: #EBEEFF;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const BasicTopicBuilder = () => (
  <Grid gridTemplateColumns={['100%', '80% 20%']} gridGap={4}>
    <Switch>
      <Route path="/topic-builder/questions" render={() => <QuestionsForm />} />
      <Route path="/topic-builder/" render={() => <BasicTopicsTopicForm />} />
    </Switch>

    <FormNav />
  </Grid>
);

const FormNav = () => (
  <ProgressContainer>
    <Div pb={4}>PROGRESS</Div>
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
    <Flex>
      <Button brand="primary">Publish</Button>
      <Button brand="default">Cancel</Button>
    </Flex>
  </ProgressContainer>
);

export default BasicTopicBuilder;
