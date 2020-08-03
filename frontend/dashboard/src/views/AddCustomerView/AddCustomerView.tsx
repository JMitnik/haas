import * as yup from 'yup';
import {
  Button, Container, Div, Flex, Form, FormGroupContainer, Grid,
  H2, H3, Hr, Muted, StyledInput, StyledLabel,
} from '@haas/ui';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import React, { useState } from 'react';

import { createNewCustomer } from '../../mutations/createNewCustomer';
import { getCustomerQuery } from '../../queries/getCustomersQuery';
import uploadSingleImage from '../../mutations/uploadSingleImage';

interface FormDataProps {
  name: string;
  slug: string;
  logo?: string;
  cloudinary?: File;
  primaryColour?: string;
  seed?: boolean;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  logo: yup.string().url(),
  slug: yup.string().required(),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/,
    { message: 'Provided colour is not a valid hexadecimal' }),
});

const AddCustomerView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>({
    validationSchema: schema,
  });
  const [activePreview, setActivePreview] = useState('');

  const [uploadFile, { loading: fileUploadLoading }] = useMutation(uploadSingleImage, {
    onCompleted: (result) => {
      setActivePreview(result.singleUpload.url);
    },
  });

  const [addCustomer, { loading, error: serverError }] = useMutation(createNewCustomer, {
    onCompleted: () => {
      history.push('/');
    },
    refetchQueries: [{ query: getCustomerQuery }],
  });

  const onChange = (event: any) => {
    setActivePreview('');
    const image: File = event.target.files[0];
    if (image) {
      uploadFile({ variables: { file: image } });
    }
  };

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      logo: activePreview || formData.logo,
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

      {serverError && (<p>{serverError.message}</p>)}

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
                  <StyledInput hasError={!!errors.name} name="name" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Logo</StyledLabel>
                  <StyledInput hasError={!!errors.logo} name="logo" ref={register({ required: false })} />
                  {errors.logo && <Muted color="warning">{errors.logo.message}</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Slug</StyledLabel>
                  <StyledInput hasError={!!errors.slug} name="slug" ref={register({ required: true })} />
                  {errors.slug && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Primary colour</StyledLabel>
                  <StyledInput hasError={!!errors.primaryColour} name="primaryColour" ref={register({ required: true })} />
                  {errors.primaryColour && <Muted color="warning">{errors.primaryColour.message}</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Logo (Cloudinary)</StyledLabel>
                  <StyledInput hasError={!!errors.cloudinary} type="file" name="cloudinary" onChange={onChange} ref={register({ required: false })} />
                  {errors.cloudinary && <Muted color="warning">Something went wrong!</Muted>}

                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Preview</StyledLabel>
                  <Div width={200} height={200} style={{ border: '1px solid lightgrey', borderRadius: '8px' }}>
                    {fileUploadLoading && (
                    <Flex height="100%" justifyContent="center" alignItems="center">
                      <Div alignSelf="center">Uploading...</Div>
                    </Flex>
                    )}
                    {activePreview && !fileUploadLoading && <img src={activePreview} height={200} width={200} alt="" />}
                  </Div>
                </Div>
                <Flex justifyContent="space-between" alignItems="center">
                  <label
                    htmlFor="seed"
                  >
                    Generate template topic for customer
                  </label>
                  <StyledInput
                    type="checkbox"
                    id="seed"
                    name="seed"
                    ref={register({ required: false })}
                  />
                </Flex>
              </Grid>

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

export default AddCustomerView;
