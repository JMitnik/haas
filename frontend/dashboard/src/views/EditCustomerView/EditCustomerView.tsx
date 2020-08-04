import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';

import {
  Button, Container, Div, Flex, Form, FormGroupContainer, Grid,
  H2, H3, Hr, Label, Muted, StyledInput,
} from '@haas/ui';
import { useCustomer } from 'providers/CustomerProvider';
import { useToast } from '@chakra-ui/core';

import editCustomerMutation from '../../mutations/editCustomer';
import getCustomerQuery from '../../queries/getCustomersQuery';
import getEditCustomerData from '../../queries/getEditCustomer';
import uploadSingleImage from '../../mutations/uploadSingleImage';

interface FormDataProps {
  name: string;
  logo: string;
  slug: string;
  primaryColour?: string;
  cloudinary?: string;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  logo: yup.string().url(),
  slug: yup.string().required(),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/,
    { message: 'Provided colour is not a valid hexadecimal' }),
});

const EditCustomerView = () => {
  const { customerSlug } = useParams();

  const { data: customerData, error, loading } = useQuery(getEditCustomerData, {
    variables: {
      customerSlug,
    },
  });

  if (loading) return null;
  if (error) return <><p>{error.message}</p></>;

  const customer = customerData?.customer;

  return <EditCustomerForm customer={customer} />;
};

const EditCustomerForm = ({ customer }: { customer: any }) => {
  const history = useHistory();
  const { activeCustomer, setActiveCustomer } = useCustomer();
  const [activePreviewUrl, setActivePreviewUrl] = useState<null | string>(null);

  const { register, handleSubmit, errors } = useForm<FormDataProps>({
    validationSchema: schema,
    defaultValues: {
      name: customer.name,
      logo: customer.settings?.logoUrl,
      primaryColour: customer.settings?.colourSettings?.primary,
      slug: customer.slug,
    },
  });

  const [uploadFile, { loading: fileUploadLoading }] = useMutation(uploadSingleImage, {
    onCompleted: (result) => {
      setActivePreviewUrl(result.singleUpload.url);
    },
  });

  const onLogoUploadChange = (event: any) => {
    setActivePreviewUrl('');
    const image: File = event.target.files[0];

    if (image) {
      uploadFile({ variables: { file: image } });
    }
  };
  const toast = useToast();

  const [editCustomer, { loading }] = useMutation(editCustomerMutation, {

    onCompleted: (result: any) => {
      const customer: any = result.editCustomer;

      localStorage.setItem('customer', JSON.stringify(customer));

      toast({
        title: 'Your business edited',
        description: 'The business has been updated',
        status: 'success',
        position: 'bottom-right',
        duration: 300,
      });

      setTimeout(() => {
        setActiveCustomer(customer);
        history.push('/');
      }, 300);
    },
    refetchQueries: [{ query: getCustomerQuery }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      logo: activePreviewUrl || formData.logo,
      slug: formData.slug,
      primaryColour: formData.primaryColour,
      name: formData.name,
    };

    editCustomer({
      variables: {
        id: customer?.id,
        options: optionInput,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Customer </H2>
        <Muted pb={4}>Edit a new customer</Muted>
      </Div>

      <Hr />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroupContainer>
          <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
            <Div py={4} pr={4}>
              <H3 color="default.text" fontWeight={500} pb={2}>General customer information</H3>
              <Muted>
                General information about the customer, such as name, logo, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <Flex flexDirection="column">
                  <Label>Name</Label>
                  <StyledInput isInvalid={!!errors.name} name="name" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <Label>Logo</Label>
                  <StyledInput isInvalid={!!errors.logo} name="logo" ref={register({ required: false })} />
                  {errors.logo && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Slug</Label>
                  <StyledInput isInvalid={!!errors.slug} name="slug" ref={register({ required: true })} />
                  {errors.slug && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Primary colour</Label>
                  <StyledInput isInvalid={!!errors.primaryColour} name="primaryColour" ref={register({ required: true })} />
                  {errors.primaryColour && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Logo (Cloudinary)</Label>
                  <StyledInput
                    isInvalid={!!errors.cloudinary}
                    type="file"
                    name="cloudinary"
                    onChange={onLogoUploadChange}
                    ref={register({ required: false })}
                  />
                  {errors.cloudinary && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Preview</Label>
                  <Div width={200} height={200} style={{ border: '1px solid lightgrey', borderRadius: '8px' }}>
                    {(!activePreviewUrl && customer?.settings?.logoUrl && !fileUploadLoading) && (
                      <img
                        src={customer?.settings?.logoUrl}
                        height={200}
                        width={200}
                        alt=""
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                    {fileUploadLoading && (
                    <Flex height="100%" justifyContent="center" alignItems="center">
                      <Div alignSelf="center">Uploading...</Div>
                    </Flex>
                    )}
                    {activePreviewUrl && <img alt="" src={activePreviewUrl} height={200} width={200} />}
                  </Div>
                </Div>
              </Grid>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Save customer</Button>
            <Button brand="default" type="button" onClick={() => history.push('/')}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

export default EditCustomerView;
