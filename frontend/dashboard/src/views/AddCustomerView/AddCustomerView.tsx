import * as yup from 'yup';
import {
  BooleanRadioInput, ButtonRadio, Container, Div, Form, FormContainer,
  FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid,
  InputHelper,
  Muted,
} from '@haas/ui';
import { Briefcase, Link } from 'react-feather';
import { Button, ButtonGroup, FormErrorMessage, RadioButtonGroup, Spinner, useToast } from '@chakra-ui/core';
import { Controller, UseFormMethods, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';
import styled from 'styled-components';

import ColorPickerInput from 'components/ColorPicker';
import parseOptionalBoolean from 'utils/parseOptionalBoolean';

import { createNewCustomer } from '../../mutations/createNewCustomer';
import getCustomerQuery from '../../queries/getCustomersQuery';
import uploadSingleImage from '../../mutations/uploadSingleImage';

interface FormDataProps {
  name: string;
  slug: string;
  logo?: string;
  // cloudinary?: File;
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

const getDropColor = (props: any) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const DropContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getDropColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

const FileDropInput = (props: any) => {
  const { onDrop, isLoading } = props;

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  const acceptedFile = acceptedFiles?.[0] || undefined;

  return (
    <section className="container">
      <DropContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <input {...getInputProps()} />
            {acceptedFile ? (
              <p>
                {acceptedFile?.name}
                {' '}
                -
                {' '}
                {acceptedFile?.size}
                {' '}
                bytes
              </p>
            ) : (
              <p>Drag the logo here, or click to select it</p>
            )}
          </>
        )}
      </DropContainer>
    </section>
  );
};

const CustomerUploadLogoInput = ({ onChange }: any) => {
  const toast = useToast();

  const [uploadFile, { loading }] = useMutation(uploadSingleImage, {
    onCompleted: (result) => {
      toast({
        title: 'Uploaded!',
        description: 'File has been uploaded.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });

      onChange(result.singleUpload.url);
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'We were unable to upload file. Try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const onDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    uploadFile({ variables: { file } });
  };

  return (
    <FileDropInput onDrop={onDrop} isLoading={loading} />
  );
};

const CustomerLogoFormFragment = ({ form }: { form: UseFormMethods<FormDataProps> }) => (
  <>
    <FormControl>
      <FormLabel>Logo</FormLabel>
      <InputHelper>Switch between uploading your own logo or inserting the url of an existing one</InputHelper>

      <Controller
        control={form.control}
        name="useCustomUrl"
        defaultValue={1}
        render={({ onChange }) => (
          <RadioButtonGroup
            defaultValue={1}
            isInline
            onChange={onChange}
            display="flex"
          >
            <ButtonRadio value={1} text="Existing url" description="Insert Existing url" />
            <ButtonRadio value={0} text="Upload file" description="Upload file" />
          </RadioButtonGroup>
        )}
      />

    </FormControl>

    {form.watch('useCustomUrl') ? (
      <FormControl>
        <FormLabel htmlFor="logo">Logo: existing URL</FormLabel>
        <InputHelper>Use the URL of an existing logo. We recommend one with no background-colors.</InputHelper>
        <Input
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
          leftEl={<Link />}
          name="logo"
          isInvalid={!!form.errors.logo}
          ref={form.register({ required: true })}
        />
      </FormControl>

    ) : (
      <>
        <FormControl>
          <FormLabel htmlFor="cloudinary">Logo: upload logo</FormLabel>
          <InputHelper>Upload a logo (preferably SVG or PNG)</InputHelper>

          <Controller
            control={form.control}
            name="uploadLogo"
            defaultValue=""
            render={({ onChange }) => (
              <CustomerUploadLogoInput onChange={onChange} />
            )}
          />

        </FormControl>
      </>
    )}

  </>
);

const AddCustomerView = () => {
  const history = useHistory();
  const toast = useToast();

  const form = useForm<FormDataProps>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const [addCustomer, { loading, error: serverError }] = useMutation(createNewCustomer, {
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
                    <Input
                      placeholder="Peach inc."
                      leftEl={<Briefcase />}
                      name="name"
                      ref={form.register({ required: true })}
                    />
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
                      defaultValue="#BEE3F8"
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
                      render={({ onChange, onBlur, value }) => (
                        <BooleanRadioInput onBlur={onBlur} value={value} onChange={onChange}>
                          <ButtonRadio value={1} text="Custom template" description="Start with a default dialogue" />
                          <ButtonRadio value={0} text="Fresh start" description="Start with a clean slate" />
                        </BooleanRadioInput>
                      )}
                      control={form.control}
                      defaultValue={1}
                    />

                  </FormControl>
                </InputGrid>
              </Div>
            </FormSection>

            <ButtonGroup>
              <Button
                isLoading={loading}
                isDisabled={!form.formState.isValid}
                variantColor="teal"
                type="submit"
              >
                Create
              </Button>
              <Button variant="outline" onClick={() => history.push('/')}>Cancel</Button>
            </ButtonGroup>
          </FormContainer>
        </motion.div>
      </Form>
    </Container>
  );
};

export default AddCustomerView;
