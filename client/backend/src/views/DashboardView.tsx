import React, { FC } from 'react'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Query } from '../types';

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
        <div>
            {topics?.map((topic, index) => (
                <div key={index}>
                    <p>
                        {topic.title}
                    </p>
                </div>
            ))}
        </div>
    )
};

export default DashboardView;
