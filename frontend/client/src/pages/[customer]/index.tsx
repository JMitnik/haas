import { CustomerFragment } from 'queries/CustomerFragment';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Loader from 'components/Loader';
import React from 'react';
import gql from 'graphql-tag';
import useProject from 'providers/ProjectProvider';

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
  const { setCustomer } = useProject();

  if (!customerSlug) {
    history.push('/');
  }

  const { data, error, loading } = useQuery(getCustomerFromSlug, {
    variables: {
      slug: customerSlug,
    },
    onError: () => {
      console.log('Shit, a mistake happened');
    },
  });

  if (loading) return <Loader />;
  if (error) return <p>An error has occured, please try again</p>;

  // Extract relevant questionnaire here, either default, first, or return to the selection
  if (!data?.customer?.dialogues) return <Loader />;

  setCustomer(data?.customer);

  return (
    <Redirect to={`/${customerSlug}/${data?.customer?.dialogues[0].id}`} />
  );
};

export default CustomerPage;
