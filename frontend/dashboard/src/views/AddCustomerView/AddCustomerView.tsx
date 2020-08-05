import * as yup from 'yup';
import { BlockPicker, ColorResult } from 'react-color';
import { Briefcase, Link } from 'react-feather';
import { Button, ButtonGroup, FormErrorMessage, RadioButtonGroup } from '@chakra-ui/core';
import {
  ButtonRadio, Container, Div, Flex, Form, FormContainer, FormControl,
  FormLabel, Grid, H3, Input, InputHelper, Label, Muted, Paragraph,
} from '@haas/ui';
import { Controller, FormContextValues, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import Dropzone from 'react-dropzone';
import React, { forwardRef, useRef, useState } from 'react';
import styled, { css } from 'styled-components/macro';

import useOnClickOutside from 'hooks/useClickOnOutside';

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

const ColorPickerContainer = styled(Div)`
  ${() => css`
    position: absolute;
    z-index: 200;
    /* top: 0; */
  `}
`;

const ColorPicker = ({ onChange, value }: any) => {
  const [isOpenPicker, setIsOpenPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(pickerRef, () => setIsOpenPicker(false));

  const handlePickerChange = (e: ColorResult) => {
    if (e.hex) onChange(e.hex);
  };

  return (
    <>
      <Div>
        <Button
          style={{ backgroundColor: value || 'auto' }}
          type="button"
          size="sm"
          onClick={() => setIsOpenPicker(!isOpenPicker)}
        >
          Primary
        </Button>

        <ColorPickerContainer ref={pickerRef}>
          {isOpenPicker && (
          <BlockPicker color={value} onChange={(e) => handlePickerChange(e)} />
          )}
        </ColorPickerContainer>
      </Div>
    </>
  );
};

const CustomerLogoForm = ({ form }: { form: FormContextValues<FormDataProps> }) => {
  const [useCustomUrl, setUseCustomUrl] = useState<boolean>(true);
  const [activePreview, setActivePreview] = useState('');

  const [uploadFile, { loading: fileUploadLoading }] = useMutation(uploadSingleImage, {
    onCompleted: (result) => {
      setActivePreview(result.singleUpload.url);
    },
  });

  const handleUploadChange = (event: any) => {
    setActivePreview('');
    const image: File = event.target.files[0];
    if (image) {
      uploadFile({ variables: { file: image } });
    }
  };

  const handleUrlRadioChange = (val: any) => {
    if (val === 1) {
      setUseCustomUrl(true);
    }

    if (val === 0) {
      setUseCustomUrl(false);
    }
  };

  return (
    <>
      <FormControl>
        <FormLabel>Use custom url</FormLabel>
        <InputHelper>Use a custom url or not.</InputHelper>
        <RadioButtonGroup
          defaultValue={1}
          isInline
          onChange={handleUrlRadioChange}
          display="flex"
        >
          <ButtonRadio value={1} text="Existing url" description="Insert Existing url" />
          <ButtonRadio value={0} text="Upload file" description="Upload file" />
        </RadioButtonGroup>
      </FormControl>

      {useCustomUrl ? (
        <FormControl>
          <FormLabel htmlFor="logo">Logo</FormLabel>
          <InputHelper>Set an existing URL of the logo (usually ending in .png or .svg)</InputHelper>
          <Input
            leftEl={<Link />}
            name="logo"
            isInvalid={!!form.errors.logo}
            ref={form.register({ required: true })}
          />
        </FormControl>

      ) : (
        <>
          <FormControl isInvalid={!!form.errors.cloudinary}>
            <FormLabel htmlFor="cloudinary">Upload Logo</FormLabel>
            <InputHelper>Upload a logo (preferably SVG or PNG)</InputHelper>

            <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} name="cloudinary" ref={form.register({ required: false })} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>

            {/* <Input type="file" name="cloudinary" onChange={onChange} ref={form.register({ required: false })} /> */}
            <FormErrorMessage>{form.errors.cloudinary?.message}</FormErrorMessage>
          </FormControl>
        </>
      )}

    </>
  );
};

const AddCustomerView = () => {
  const history = useHistory();

  const form = useForm<FormDataProps>({
    validationSchema: schema,
    mode: 'onChange',
  });

  const [addCustomer, { loading, error: serverError }] = useMutation(createNewCustomer, {
    onCompleted: () => {
      history.push('/');
    },
    refetchQueries: [{ query: getCustomerQuery }],
  });

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {

      // TODO: Put back
      logo: '' || formData.logo,
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
      {/* <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Customer </H2>
        <Muted pb={4}>Create a new customer</Muted>
      </Div> */}

      {serverError && (<p>{serverError.message}</p>)}
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
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
                  <FormControl isInvalid={!!form.errors.name} isRequired>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <InputHelper>What is the name of the business?</InputHelper>
                    <Input placeholder="Peach inc." leftEl={<Briefcase />} name="name" ref={form.register({ required: true })} />
                    <FormErrorMessage>{form.errors.name?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!form.errors.slug} isRequired>
                    <FormLabel htmlFor="name">Slug</FormLabel>
                    <InputHelper>Under which url segment will visitors find the business?</InputHelper>
                    <Input
                      placeholder="peach"
                      leftAddOn="https://client.haas.live/"
                      name="slug"
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.slug?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!form.errors.primaryColour} isRequired>
                    <FormLabel htmlFor="primaryColour">Branding color</FormLabel>
                    <InputHelper>What is the main brand color of the company?</InputHelper>
                    <Controller
                      control={form.control}
                      name="primaryColour"
                      as={<ColorPicker />}
                    />
                  </FormControl>
                </Grid>

                <Div />

                <Grid mt={4} gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}>
                  <CustomerLogoForm form={form} />
                </Grid>

                <Grid mt={4} gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}>
                  <FormControl>
                    <FormLabel>Use template</FormLabel>
                    <InputHelper>Start the onboarding with a pre-existing template, or start clean.</InputHelper>
                    <RadioButtonGroup
                      defaultValue={1}
                      isInline
                      display="flex"
                    >
                      <ButtonRadio value={1} text="Custom template" description="Start with a default dialogue" />
                      <ButtonRadio value={0} text="Fresh start" description="Start with a clean slate" />
                    </RadioButtonGroup>
                  </FormControl>
                </Grid>
              </Div>
            </Grid>
            <ButtonGroup>
              <Button isLoading={loading} isDisabled={!form.formState.isValid} variantColor="teal" type="submit">Create</Button>
              <Button variant="outline" onClick={() => history.push('/')}>Cancel</Button>
            </ButtonGroup>
          </FormContainer>
        </motion.div>
      </Form>
    </Container>
  );
};

export default AddCustomerView;
