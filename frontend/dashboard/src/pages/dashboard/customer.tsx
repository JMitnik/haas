import { Redirect, useParams } from 'react-router-dom';
import React from 'react';

const CustomerPage = () => {
  const { customerSlug } = useParams<any>();

  return (
    <Redirect to={`/dashboard/b/${customerSlug}/d`} />
  );
};

export default CustomerPage;
