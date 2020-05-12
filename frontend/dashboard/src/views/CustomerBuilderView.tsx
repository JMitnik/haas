import React from 'react';

import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import {
  Container, Flex, Grid, H2, H3, Muted, Button,
  Div, StyledLabel, StyledInput, Hr, FormGroupContainer, Form
} from '@haas/ui';
import { getCustomerQuery } from '../queries/getCustomersQuery';
import { createNewCustomer } from '../mutations/createNewCustomer';
import uploadSingleImage from '../mutations/uploadSingleImage';
interface FormDataProps {
  name: string;
  logo: string;
  slug: string;
  cloudinary?: File;
  primaryColour?: string;
  seed?: boolean;
}

const CustomerBuilderView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const [uploadFile] = useMutation(uploadSingleImage)
  const [addCustomer, { loading }] = useMutation(createNewCustomer, {
    onCompleted: () => {
      history.push('/');
    },
    refetchQueries: [{ query: getCustomerQuery }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const onChange = (event: any) => {
    const image: File = event.target.files[0];
    // TODO: New upload file mutation 
    console.log(image);
    if (image) {
      uploadFile({ variables: { file: image } });
    } 
  }

  const onSubmit = (formData: FormDataProps) => {
    // TODO: Add cloudinary link instead of file 
    const optionInput = {
      logo: formData.logo,
      slug: formData.slug,
      isSeed: formData.seed,
      primaryColour: formData.primaryColour,
    };
    // TODO: Make better typescript supported
    addCustomer({
      variables: {
        name: formData.name,
        options: optionInput,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Customer </H2>
        <Muted pb={4}>Create a new customer</Muted>
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
                  <StyledInput name="name" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Logo</StyledLabel>
                  <StyledInput name="logo" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Slug</StyledLabel>
                  <StyledInput name="slug" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Primary colour</StyledLabel>
                  <StyledInput name="primaryColour" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Logo (Cloudinary)</StyledLabel>
                  <StyledInput type="file" name="cloudinary" onChange={onChange} ref={register({ required: false })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                  
                </Div>
                <img src='https://res.cloudinary.com/haas-storage/image/upload/v1589279324/foo/yjdm21gxsluzfyqr6agn.jpg' height={100} width={100}/>
              </Grid>
              <Div py={4}>
                <StyledInput
                  type="checkbox"
                  id="seed"
                  name="seed"
                  ref={register({ required: false })}
                />
                <label htmlFor="seed"> Generate template topic for customer </label>
              </Div>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create topic</Button>
            <Button brand="default" type="button" onClick={() => history.push('/')}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

export default CustomerBuilderView;
