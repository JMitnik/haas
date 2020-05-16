import React, { useState } from 'react';

import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import {
  Container, Flex, Grid, H2, H3, Muted, Button,
  Div, StyledLabel, StyledInput, Hr, FormGroupContainer, Form
} from '@haas/ui';

import { getCustomerQuery } from '../queries/getCustomersQuery';
import editCustomerMutation from '../mutations/editCustomer';
import getEditCustomerData from '../queries/getEditCustomer';
import uploadSingleImage from '../mutations/uploadSingleImage';

interface FormDataProps {
  name: string;
  logo: string;
  slug: string;
  primaryColour?: string;
  cloudinary?: string;
}

const EditCustomerView = () => {
  const history = useHistory();
  const { customerId } = useParams();
  const [activePreview, setActivePreview] = useState('');
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const [uploadFile] = useMutation(uploadSingleImage,
    {
      onCompleted: (result) => {
        setActivePreview(result.singleUpload.url);
      },
    })
  const getEditCustomerQuery = useQuery(getEditCustomerData, {
    variables: {
      id: customerId
    }
  })

  const [editCustomer, { loading }] = useMutation(editCustomerMutation, {
    onCompleted: () => {
      history.push('/');
    },
    refetchQueries: [{ query: getCustomerQuery }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  if (getEditCustomerQuery.loading) return null;

  const onChange = (event: any) => {
    const image: File = event.target.files[0];
    if (image) {
      uploadFile({ variables: { file: image } });
    }
  }

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      logo: activePreview,
      slug: formData.slug,
      primaryColour: formData.primaryColour,
      name: formData.name
    };
    editCustomer({
      variables: {
        id: getEditCustomerQuery.data?.customer?.id,
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
                  <StyledLabel>Name</StyledLabel>
                  <StyledInput defaultValue={getEditCustomerQuery.data?.customer?.name} name="name" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Logo</StyledLabel>
                  <StyledInput defaultValue={getEditCustomerQuery.data?.customer?.settings?.logoUrl} name="logo" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Slug</StyledLabel>
                  <StyledInput defaultValue={getEditCustomerQuery.data?.customer?.slug} name="slug" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Primary colour</StyledLabel>
                  <StyledInput defaultValue={getEditCustomerQuery.data?.customer?.settings?.colourSettings?.primary} name="primaryColour" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Logo (Cloudinary)</StyledLabel>
                  <StyledInput type="file" name="cloudinary" onChange={onChange} ref={register({ required: false })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Preview</StyledLabel>
                  <Div width={200} height={200} style={{ border: '1px solid lightgrey', borderRadius: '8px' }}>
                    { (!activePreview && getEditCustomerQuery.data?.customer?.settings?.logoUrl) && <img src={getEditCustomerQuery.data?.customer?.settings?.logoUrl} height={200} width={200} style={{ objectFit: 'contain' }} />}
                    { activePreview && <img src={activePreview} height={200} width={200} />}
                  </Div>
                </Div>
              </Grid>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Save topic</Button>
            <Button brand="default" type="button" onClick={() => history.push('/')}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

export default EditCustomerView;
