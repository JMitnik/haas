import { ApolloError } from 'apollo-boost';
import { Card, CardBody, Container, DeleteButtonContainer, Div, EditButtonContainer, Flex, Grid,
  H2, H3, Label } from '@haas/ui';
import { Edit, MapPin, Plus, User, X } from 'react-feather';
import { Link, useHistory, useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { FC, useCallback, useState } from 'react';

import SearchBar from 'components/SearchBar/SearchBar';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';

import { AddTopicCard, InputContainer } from './TopicsOverviewStyles';
import { deleteQuestionnaireMutation } from '../../mutations/deleteQuestionnaire';
import getQuestionnairesCustomerQuery from '../../queries/getQuestionnairesCustomerQuery';

interface TagProps {
  name: string;
  type: string;
}

const TopicsOverview: FC = () => {
  const { customerId } = useParams();
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setActiveSearchTerm(newSearchTerm);
  }, 250), []);

  const { loading, error, data } = useQuery<any>(getQuestionnairesCustomerQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: customerId,
      filter: { searchTerm: activeSearchTerm },
    },
  });

  // if (loading) return <p>Loading</p>;

  if (error) {
    return (
      <p>
        Error:
        {' '}
        {error.message}
      </p>
    );
  }
  console.log('active search term: ', activeSearchTerm);
  const topics: Array<any> = data?.dialogues;

  return (
    <>
      <Container>
        <H2 color="default.text" fontWeight={400} mb={4}>Dialogues</H2>
        <InputContainer marginBottom="20px" marginTop="5px" justifyContent="flex-end">
          <SearchBar
            activeSearchTerm={activeSearchTerm}
            onSearchTermChange={handleSearchTermChange}
          />
        </InputContainer>
        <Grid
          gridGap={4}
          gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
          gridAutoRows="minmax(200px, 1fr)"
        >

          {!loading && topics?.map((topic, index) => topic && <TopicCard key={index} topic={topic} />)}

          <AddTopicCard>
            <Link to={`/dashboard/c/${customerId}/topic-builder`} />
            <Div>
              <Plus />
              <H3>
                Add dialogue
              </H3>
            </Div>
          </AddTopicCard>
        </Grid>
      </Container>
    </>
  );
};

const TopicCard = ({ topic }: { topic: any }) => {
  const history = useHistory();
  const { customerId } = useParams();

  const [deleteTopic] = useMutation(deleteQuestionnaireMutation, {
    refetchQueries: [{
      query: getQuestionnairesCustomerQuery,
      variables: {
        id: customerId,
      },
    }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const deleteClickedCustomer = async (event: any, topicId: string) => {
    deleteTopic({
      variables: {
        id: topicId,
      },
    });
    event.stopPropagation();
  };

  const setEditDialogue = (event: any, topicId: string) => {
    history.push(`/dashboard/c/${customerId}/t/${topicId}/edit`);
    event.stopPropagation();
  };

  return (
    <Card useFlex flexDirection="column" onClick={() => history.push(`/dashboard/c/${customerId}/t/${topic.id}`)}>
      <CardBody useFlex flexDirection="column" flex="100%">
        <EditButtonContainer onClick={(e) => setEditDialogue(e, topic.id)}>
          <Edit />
        </EditButtonContainer>
        <DeleteButtonContainer
          onClick={(e) => deleteClickedCustomer(e, topic.id)}
        >
          <X />
        </DeleteButtonContainer>
        <Flex alignItems="center" justifyContent="space-between">
          <H3 fontWeight={500}>
            {topic.title}
          </H3>
          <Label brand="success">
            {topic.averageScore === 'false' ? 'N/A' : Number(topic.averageScore).toFixed(1)}
          </Label>
        </Flex>
        <Flex flex="100%">
          <Flex alignSelf="flex-end" marginTop="5px" flexDirection="row">
            {topic?.tags && topic?.tags?.map((tag: any, index: number) => (<Tag key={index} tag={tag} />))}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

const Tag = ({ tag }: { tag: TagProps }) => (
  <Flex marginRight="5px" borderRadius="8px" border="1px solid" padding="5px" paddingLeft="2px" alignItems="center">
    {tag.type === 'LOCATION' && (
    <MapPin />
    )}
    {tag.type === 'AGENT' && (
    <User />
    )}
    {tag.type === 'DEFAULT' && (
    <SliderNodeIcon color="black" />
    )}
    <Div marginLeft="2px">{tag.name}</Div>
  </Flex>

);

export default TopicsOverview;
