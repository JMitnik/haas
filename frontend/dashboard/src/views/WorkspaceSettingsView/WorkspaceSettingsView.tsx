import * as UI from '@haas/ui';
import * as yup from 'yup';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';

import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';

import CustomerForm from 'components/CustomerForm';
import boolToInt from 'utils/booleanToNumber';
import intToBool from 'utils/intToBool';

import { View } from 'layouts/View';
import getEditCustomerData from '../../queries/getEditCustomer';

const editWorkspaceMutation = gql`
  mutation editWorkspace($input: EditWorkspaceInput) {
    editWorkspace(input: $input) {
        id
        name
        slug
        settings {
          logoUrl
          logoOpacity
          colourSettings {
          primary
        }
      }
    }
  }
`;

const schema = yup.object().shape({
  name: yup.string().required(),
  logo: yup.string().url(),
  uploadLogo: yup.string().url(),
  logoOpacity: yup.number().min(0).max(1),
  slug: yup.string().required(),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
  useCustomUrl: yup.number(),
}).required();

type FormDataProps = yup.InferType<typeof schema>;

const startsWithCloudinary = (url: string) => url.includes('cloudinary');

const WorkspaceSettingsForm = ({ customer }: { customer: any }) => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const history = useHistory();
  const toast = useToast();

  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: customer.name,
      logo: customer.settings?.logoUrl,
      logoOpacity: (customer.settings?.logoOpacity !== undefined && customer.settings?.logoOpacity !== null)
        ? Math.min(Math.max(0, customer.settings?.logoOpacity / 100), 1)
        : 0.3,
      uploadLogo: customer.settings?.logoUrl,
      useCustomUrl: boolToInt(!startsWithCloudinary(customer.settings?.logoUrl || '')),
      primaryColour: customer.settings?.colourSettings?.primary,
      slug: customer.slug,
    },
    mode: 'onChange',
  });

  const [editWorkspace, { loading: isLoading, error: serverErrors }] = useMutation(editWorkspaceMutation, {
    onCompleted: (result: any) => {
      const editedWorkspace = result.editCustomer;

      localStorage.setItem('customer', JSON.stringify(editedWorkspace));

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
    editWorkspace({
      variables: {
        input: {
          id: customer?.id,
          customerSlug,
          logo: intToBool(formData.useCustomUrl) ? formData.logo : formData.uploadLogo,
          logoOpacity: (formData.logoOpacity !== null && formData.logoOpacity !== undefined)
            ? formData.logoOpacity * 100
            : 0,
          slug: formData.slug,
          primaryColour: formData.primaryColour,
          name: formData.name,
        },
      },
    }).then(() => {
      if (formData.slug !== customerSlug) {
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
    <UI.FormContainer>
      <CustomerForm
        form={form}
        isLoading={isLoading}
        onFormSubmit={onSubmit}
        serverErrors={serverErrors}
        isInEdit
      />
    </UI.FormContainer>
  );
};

export const WorkspaceSettingsView = () => {
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { t } = useTranslation();

  const { data: customerData, error, loading } = useQuery(getEditCustomerData, {
    variables: {
      customerSlug,
    },
  });

  if (loading) return null;
  if (error) return <><p>{error.message}</p></>;

  const customer = customerData?.customer;

  return (
    <View documentTitle="haas | Settings">
      <UI.ViewHead>
        <UI.Div>
          <UI.ViewTitle>{t('views:edit_business_settings_view')}</UI.ViewTitle>
          <UI.ViewSubTitle>{t('views:edit_business_settings_subtitle')}</UI.ViewSubTitle>
        </UI.Div>
      </UI.ViewHead>

      <UI.ViewBody>
        <WorkspaceSettingsForm customer={customer} />
      </UI.ViewBody>
    </View>
  );
};