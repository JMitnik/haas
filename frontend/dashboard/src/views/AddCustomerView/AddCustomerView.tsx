import * as yup from 'yup';
import { BlockPicker, ColorResult } from 'react-color';
import { Briefcase, Link } from 'react-feather';
import { Button, ButtonGroup, FormErrorMessage, RadioButtonGroup } from '@chakra-ui/core';
import {
  ButtonRadio, Container, Div, Flex, Form, FormContainer, FormControl,
  FormLabel, FormSection, Grid, H3, H4, Hr, Input, InputGrid, InputHelper,
  Label,
  Muted,
  Paragraph,
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

const ColorPickerInput = ({ onChange, value }: any) => {
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

const BooleanRadioInput = ({ onChange, children }: any) => {
  const handleButtonChange = (val: any) => {
    if (val === 1) {
      onChange(true);
    }

    if (val === -1) {
      onChange(false);
    }
  };

  return (
    <RadioButtonGroup
      defaultValue={-1}
      isInline
      onChange={(val) => handleButtonChange(val)}
      display="flex"
    >
      {children}
    </RadioButtonGroup>
  );
};

const CustomerLogoFormFragment = ({ form }: { form: FormContextValues<FormDataProps> }) => {
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
        <FormLabel>Logo</FormLabel>
        <InputHelper>Switch between uploading your own logo or inserting the url of an existing one</InputHelper>
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
          <FormLabel htmlFor="logo">Logo: existing URL</FormLabel>
          <InputHelper>Use the URL of an existing logo. We recommend one with no background-colors.</InputHelper>
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
            <FormLabel htmlFor="cloudinary">Logo: upload your own logo</FormLabel>
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

  console.log(form);

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
            <FormSection id="about">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>About</H3>
                <Muted color="gray.600">
                  Please tell us a bit about the business, such as under which name and URL we can find it.
                </Muted>
              </Div>
              <Div py={4}>
                <InputGrid>
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
                </InputGrid>

                <Div />

              </Div>
            </FormSection>

            <Hr />

            <FormSection id="branding">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>Branding</H3>
                <Muted color="gray.600">
                  Describe the branding of your company, including logo and color
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isInvalid={!!form.errors.primaryColour} isRequired>
                    <FormLabel htmlFor="primaryColour">Branding color</FormLabel>
                    <InputHelper>What is the main brand color of the company?</InputHelper>
                    <Controller
                      control={form.control}
                      name="primaryColour"
                      as={<ColorPickerInput />}
                    />
                  </FormControl>
                </InputGrid>

                <InputGrid>
                  <CustomerLogoFormFragment form={form} />
                </InputGrid>
              </Div>
            </FormSection>

            <Hr />

            <FormSection id="template">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>Template</H3>
                <Muted color="gray.600">
                  Choose whether you have a preference what to start with.
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl>
                    <FormLabel>Use template</FormLabel>
                    <InputHelper>Start the onboarding with a pre-existing template, or start clean.</InputHelper>
                    <Controller
                      name="seed"
                      render={({ onChange }) => (
                        <BooleanRadioInput onChange={onChange}>
                          <ButtonRadio value={-1} text="Custom template" description="Start with a default dialogue" />
                          <ButtonRadio value={1} text="Fresh start" description="Start with a clean slate" />
                        </BooleanRadioInput>
                      )}
                      control={form.control}
                      defaultValue={0}
                    />

                  </FormControl>
                </InputGrid>
              </Div>
            </FormSection>

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
