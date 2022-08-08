import * as yup from 'yup';
import {
  Container, FormContainer,
} from '@haas/ui';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useToast } from '@chakra-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';

import { CreateWorkspaceInput } from 'types/globalTypes';
import { MATCH_COLOR_FORMAT, MATCH_URL_EXTENSION_FORMAT } from 'utils/validationHelpers';
import CustomerForm from 'components/CustomerForm';
import intToBool from 'utils/intToBool';

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
  name: yup.string().required('validation:field_required'),
  logo: yup.string().url('Url should be valid'),
  logoOpacity: yup.number().min(0).max(1),
  slug: yup
    .string()
    .matches(MATCH_URL_EXTENSION_FORMAT, { message: 'validation:url_extension_format_not_supported' })
    .required('validation:field_required'),
  primaryColour: yup.string().required().matches(MATCH_COLOR_FORMAT, {
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
    defaultValues: {
      logoOpacity: 0.3,
    },
  });

  const [createWorkspace, { loading, error: serverErrors }] = useMutation<null, { input: CreateWorkspaceInput }>(
    createWorkspaceMutation, {
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
    },
  );

  const onSubmit = (formData: FormDataProps) => {
    createWorkspace({
      variables: {
        input: {
          name: formData.name,
          logo: intToBool(formData.useCustomUrl) ? formData.logo : formData.uploadLogo,
          logoOpacity: (formData?.logoOpacity ?? 0.3) * 100,
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
