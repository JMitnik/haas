import * as yup from 'yup';
import {
  FormContainer, PageTitle,
} from '@haas/ui';
import { motion } from 'framer-motion';
import { useCustomer } from 'providers/CustomerProvider';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';

import CustomerForm from 'components/CustomerForm';
import booleanToNumber from 'utils/booleanToNumber';
import parseOptionalBoolean from 'utils/parseOptionalBoolean';

import { queryMe, useUser } from 'providers/UserProvider';
import { useTranslation } from 'react-i18next';
import editCustomerMutation from '../../mutations/editCustomer';
import getCustomersOfUser from '../../queries/getCustomersOfUser';
import getEditCustomerData from '../../queries/getEditCustomer';

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

const startsWithCloudinary = (url: string) => url.includes('cloudinary');

const EditCustomerForm = ({ customer }: { customer: any }) => {
  const { customerSlug } = useParams();
  const history = useHistory();
  const { setActiveCustomer } = useCustomer();
  const { hardRefreshUser } = useUser();
  const { t } = useTranslation();
  const toast = useToast();

  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: customer.name,
      logo: customer.settings?.logoUrl,
      useCustomUrl: booleanToNumber(!startsWithCloudinary(customer.settings?.logoUrl)),
      primaryColour: customer.settings?.colourSettings?.primary,
      slug: customer.slug,
    },
    mode: 'onBlur',
  });

  const [editCustomer, { loading: isLoading, error: serverErrors }] = useMutation(editCustomerMutation, {
    onCompleted: (result: any) => {
      const customer: any = result.editCustomer;

      localStorage.setItem('customer', JSON.stringify(customer));

      toast({
        title: 'Your business edited',
        description: 'The business has been updated',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'See form for more information',
        status: 'error',
        position: 'bottom-right',
        duration: 300,
      });
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      logo: parseOptionalBoolean(formData.useCustomUrl) ? formData.logo : formData.uploadLogo,
      slug: formData.slug,
      isSeed: parseOptionalBoolean(formData.seed),
      primaryColour: formData.primaryColour,
      name: formData.name,
    };

    editCustomer({
      variables: {
        id: customer?.id,
        options: optionInput,
      },
    }).then(() => {
      if (optionInput.slug !== customerSlug) {
        toast({
          title: 'Redirecting to new slug',
          description: 'Redirecting user to new slug adress.',
          status: 'info',
          position: 'bottom-right',
          duration: 1500,
        });

        setTimeout(() => {
          history.push(`/dashboard/b/${formData.slug}`);
        }, 1000);
      } else {
        history.push(`/dashboard/b/${customerSlug}`);
      }
    });
  };

  return (
    <>
      <PageTitle>{t('views:edit_business_settings_view')}</PageTitle>
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
        <FormContainer>
          <CustomerForm
            form={form}
            isLoading={isLoading}
            onFormSubmit={onSubmit}
            serverErrors={serverErrors}
            isInEdit
          />
        </FormContainer>
      </motion.div>
    </>
  );
};

export default EditCustomerView;
