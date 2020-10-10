import * as yup from 'yup';
import {
  Container, FormContainer,
} from '@haas/ui';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';

import CustomerForm from 'components/CustomerForm';
import parseOptionalBoolean from 'utils/parseOptionalBoolean';

import { useUser } from '../../providers/UserProvider';
import createWorkspaceMutation from '../../mutations/createWorkspace';
import getCustomersOfUser from '../../queries/getCustomersOfUser';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  logo: yup.string().url('Url should be valid'),
  slug: yup.string().required('Slug is required'),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
  useSeed: yup.number(),
  willGenerateFakeData: yup.number(),
  useCustomUrl: yup.number(),
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

  const [createWorkspace, { loading, error: serverErrors }] = useMutation(createWorkspaceMutation, {
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
    const optionInput = {
      logo: parseOptionalBoolean(formData.useCustomUrl) ? formData.logo : formData.uploadLogo,
      slug: formData.slug,
      isSeed: parseOptionalBoolean(formData.seed),
      primaryColour: formData.primaryColour,
    };

    createWorkspace({
      variables: {
        name: formData.name,
        options: optionInput,
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
