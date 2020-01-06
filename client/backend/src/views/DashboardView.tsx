import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_TOPICS_QUERY = gql`
    {
        topics {
            title
        }
    }
`;

const DashboardView = () => {
    const { loading, error, data } = useQuery(GET_TOPICS_QUERY);

    if (loading) return <p>Loading</p>
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            We got data!
        </div>
    )
};

export default DashboardView;
