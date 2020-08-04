import * as yup from 'yup';
import { BlockPicker } from 'react-color';
import {
  Button, Container, Div, Flex, Form, FormContainer, FormLabel,
  Grid, H3, Input, InputHelper, Label, Muted, StyledInput,
} from '@haas/ui';
import { FormControl, FormErrorMessage } from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import React, { useState } from 'react';

import { Briefcase, Link } from 'react-feather';
import { createNewCustomer } from '../../mutations/createNewCustomer';
import getCustomerQuery from '../../queries/getCustomersQuery';
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
  name: yup.string().required('Name is required'),
  logo: yup.string().url('Url should be valid'),
  slug: yup.string().required('Slug is required'),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
});

const AddCustomerView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>({
    validationSchema: schema,
    mode: 'onBlur',
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

  console.log(errors);

  return (
    <Container>
      {/* <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Customer </H2>
        <Muted pb={4}>Create a new customer</Muted>
      </Div> */}

      {serverError && (<p>{serverError.message}</p>)}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <Grid gridTemplateColumns={['1fr', '1fr', '1fr 3fr']} gridColumnGap="50px">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>About</H3>
              <Muted color="gray.600">
                Please tell us a bit about the business, such as under which name and URL we can find it.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}>
                <FormControl isInvalid={!!errors.name} isRequired>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <InputHelper>What is the name of the business?</InputHelper>
                  <Input placeholder="Peach inc." leftEl={<Briefcase />} name="name" ref={register({ required: true })} />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.slug} isRequired>
                  <FormLabel htmlFor="name">Slug</FormLabel>
                  <InputHelper>Under which url segment will visitors find the business?</InputHelper>
                  <Input
                    placeholder="peach"
                    leftAddOn="https://client.haas.live/"
                    name="slug"
                    ref={register({ required: true })}
                  />
                  <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.primaryColour} isRequired>
                  <FormLabel htmlFor="name">Branding color</FormLabel>
                  <InputHelper>What is the main brand color of the company?</InputHelper>
                  <BlockPicker />
                  {/* <Input
                    placeholder="peach"
                    leftAddOn="https://client.haas.live/"
                    name="slug"
                    ref={register({ required: true })}
                  />
                  <FormErrorMessage>{errors.slug?.message}</FormErrorMessage> */}
                </FormControl>

                {/* <Flex flexDirection="column">
                  <Label>Name</Label>
                  <InputGroup>
                    <ChakraInput size="md" isInvalid={!!errors.name} name="name" ref={register({ required: true })} />
                    {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                  </InputGroup>
                </Flex> */}
                <Div useFlex flexDirection="column">
                  <Label>Primary colour</Label>
                  <StyledInput isInvalid={!!errors.primaryColour} name="primaryColour" ref={register({ required: true })} />
                  {errors.primaryColour && <Muted color="warning">{errors.primaryColour.message}</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Logo (Cloudinary)</Label>
                  <StyledInput isInvalid={!!errors.cloudinary} type="file" name="cloudinary" onChange={onChange} ref={register({ required: false })} />
                  {errors.cloudinary && <Muted color="warning">Something went wrong!</Muted>}

                </Div>
                <FormControl>
                  <FormLabel htmlFor="logo">Logo</FormLabel>
                  <Input leftEl={<Link />} name="logo" isInvalid={!!errors.logo} ref={register({ required: true })} />
                </FormControl>
                <Div useFlex flexDirection="column">
                  <Label>Preview</Label>
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
        </FormContainer>

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
