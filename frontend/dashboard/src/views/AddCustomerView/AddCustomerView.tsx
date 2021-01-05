import * as yup from 'yup';
import {
  Container, FormContainer,
} from '@haas/ui';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';
import { useToast } from '@chakra-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';
import { gql } from '@apollo/client';

import CustomerForm from 'components/CustomerForm';
import intToBool from 'utils/intToBool';

import { CreateWorkspaceInput } from 'types/globalTypes';
import { useUser } from '../../providers/UserProvider';
import getCustomersOfUser from '../../queries/getCustomersOfUser';

const createWorkspaceMutation = gql`
  mutation createWorkspace($input: CreateWorkspaceInput) {
    createWorkspace(input: $input) {
        name
    }
  }
`;

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  logo: yup.string().url('Url should be valid'),
  slug: yup.string().required('Slug is required'),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
  seed: yup.number(),
  willGenerateFakeData: yup.number(),
  useCustomUrl: yup.number(),
  uploadLogo: yup.string().url(),
}).required();

type FormDataProps = yup.InferType<typeof schema>;

const AddCustomerView = () => {
  const history = useHistory();
  const toast = useToast();
  const { user, refreshUser } = useUser();

  const form = useForm<FormDataProps>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const [createWorkspace, { loading, error: serverErrors }] = useMutation<null, { input: CreateWorkspaceInput }>(createWorkspaceMutation, {
    onCompleted: () => {
      toast({
        title: 'Created!',
        description: 'A new business has been added.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });

      refreshUser();

      setTimeout(() => {
        history.push('/');
      }, 500);
    },
    onError: () => {
      toast({
        title: 'Unexpected error!',
        description: 'See the form for more information.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
    refetchQueries: [{
      query: getCustomersOfUser,
      variables: {
        userId: user?.id,
      },
    }],
  });

  const onSubmit = (formData: FormDataProps) => {
    createWorkspace({
      variables: {
        input: {
          name: formData.name,
          logo: intToBool(formData.useCustomUrl) ? formData.logo : formData.uploadLogo,
          slug: formData.slug,
          isSeed: intToBool(formData.seed),
          willGenerateFakeData: intToBool(formData.willGenerateFakeData),
          primaryColour: formData.primaryColour,
        },
      },
    });
  };

  return (
    <Container>
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
        <FormContainer>
          <CustomerForm
            isInEdit={false}
            form={form}
            isLoading={loading}
            onFormSubmit={onSubmit}
            serverErrors={serverErrors}
          />
        </FormContainer>
      </motion.div>
    </Container>
  );
};

export default AddCustomerView;
