import { CustomerFragment } from 'queries/CustomerFragment';
import { motion } from 'framer-motion';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Loader from 'components/Loader';
import React, { useEffect } from 'react';
import gql from 'graphql-tag';

const getCustomerFromSlug = gql`
  query customer($slug: String!) {
    customer(slug: $slug) {
        ...CustomerFragment
    }
  }

  ${CustomerFragment}
`;

const CustomerPage = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const history = useHistory();

  if (!customerSlug) {
    history.push('/');
  }

  const { data, error, loading } = useQuery(getCustomerFromSlug, {
    variables: {
      slug: customerSlug,
    },
  });

  useEffect(() => {
    if (data) {
      history.push(`/${customerSlug}/${data?.customer?.dialogues?.[0].slug}`);
    }
  }, [data, customerSlug, history]);

  // TODO: Clear this up better

  if (loading) return <Loader />;
  if (error) return <p>An error has occured, please try again</p>;
  if (!data?.customer?.dialogues) return <Loader />;

  return (
    <motion.div exit={{ opacity: 1 }}>
      <Loader />
    </motion.div>
  );
};

export default CustomerPage;
