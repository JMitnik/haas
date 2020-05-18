import React from 'react';
import gql from 'graphql-tag';
import { useParams, Redirect, useLocation, useHistory } from 'react-router-dom';
import { CustomerFragment } from 'queries/CustomerFragment';
import { useQuery } from '@apollo/react-hooks';
import Loader from 'components/Loader';

const getCustomerFromSlug = gql`
    query customer($slug: String!) {
        customer(slug: $slug) {
            ...CustomerFragment
        }
    }

    ${CustomerFragment}
`;


const CustomerPage = () => {
    const { customerSlug } = useParams();
    const history = useHistory();
    const location = useLocation();

    if (!customerSlug) {
        history.push('/');
    }

    const { data, error, loading } = useQuery(getCustomerFromSlug, {
        variables: {
            slug: customerSlug,
        },
        onError: () => {
            console.log("Shit, a mistake happened");
        }
    });

    if (loading) return <Loader/>
    if (error) return <p>Shit</p>

    // Extract relevant questionnaire here, either default, first, or return to the selection
    if (!data?.customer?.dialogues) return <Loader />

    return (
        <Redirect to={`${location.pathname}/${data?.customer?.dialogues[0].id}`} />
    );
}

export default CustomerPage;
