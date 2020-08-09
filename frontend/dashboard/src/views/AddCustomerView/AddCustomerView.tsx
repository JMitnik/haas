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

import { createNewCustomer } from '../../mutations/createNewCustomer';
import getCustomerQuery from '../../queries/getCustomersQuery';

interface FormDataProps {
  name: string;
  slug: string;
  logo?: string;
  primaryColour?: string;
  useCustomUrl?: number;
  uploadLogo?: string;
  seed?: number;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  logo: yup.string().url('Url should be valid'),
  slug: yup.string().required('Slug is required'),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
});

const AddCustomerView = () => {
  const history = useHistory();
  const toast = useToast();

  const form = useForm<FormDataProps>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const [addCustomer, { loading, error: serverErrors }] = useMutation(createNewCustomer, {
    onCompleted: () => {
      toast({
        title: 'Created!',
        description: 'A new business has been added.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });

      setTimeout(() => {
        history.push('/');
      }, 500);
    },
    onError: (error) => {
      toast({
        title: 'Unexpected error!',
        description: 'See the form for more information.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
    refetchQueries: [{ query: getCustomerQuery }],
  });

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      logo: parseOptionalBoolean(formData.useCustomUrl) ? formData.logo : formData.uploadLogo,
      slug: formData.slug,
      isSeed: parseOptionalBoolean(formData.seed),
      primaryColour: formData.primaryColour,
    };

    addCustomer({
      variables: {
        name: formData.name,
        options: optionInput,
      },
    });
  };

  return (
    <Container>
      {/* <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Customer </H2>
        <Muted pb={4}>Create a new customer</Muted>
      </Div> */}
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
        <FormContainer>
          <CustomerForm isInEdit={false} form={form} isLoading={loading} onFormSubmit={onSubmit} serverErrors={serverErrors} />
        </FormContainer>
      </motion.div>
    </Container>
  );
};

export default AddCustomerView;
