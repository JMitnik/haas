import React, { FC } from 'react'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Query } from '../types';
import Card from '../components/UI/Cards';
import styled, { css } from 'styled-components';

const GET_TOPICS_QUERY = gql`
    {
        topics {
            title
        }
    }
`;

const DashboardView: FC = () => {
    const { loading, error, data } = useQuery<Query>(GET_TOPICS_QUERY);

    if (loading) return <p>Loading</p>
    if (error) return <p>Error: {error}</p>

    const topics = data?.topics;

    return (
        <DashboardContainer>
            <CardGrid>
                {topics?.map((topic, index) => (
                    <Card key={index}>
                        <p>
                            {topic.title}
                        </p>
                    </Card>
                ))}
            </CardGrid>
        </DashboardContainer>
    )
};

const DashboardContainer = styled.div`
    ${({ theme }) => css`
        max-width: ${theme.containerWidth}px;
        display: grid;

    `}
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;


export default DashboardView;
