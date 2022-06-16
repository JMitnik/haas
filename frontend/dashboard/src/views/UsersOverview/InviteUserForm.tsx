import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { FormErrorMessage, useToast } from '@chakra-ui/core';
import { Mail } from 'react-feather';
import { gql, useMutation } from '@apollo/client';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import Select from 'react-select';

import { useCustomer } from 'providers/CustomerProvider';
import { useGetRolesQuery } from 'types/generated-types';
import getUsersQuery from 'queries/getUsers';

interface SelectType {
  label: string;
  value: string;
}

const inviteUserMutation = gql`
  mutation inviteUser($input: InviteUserInput) {
    inviteUser(input: $input) {
      didInvite
      didAlreadyExist
    }
  }
`;

interface FormDataProps {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: SelectType;
}

const schema = yup.object().shape({
  email: yup.string().email('Expected email format').required(),
  role: yup.object().shape({
    value: yup.string().required(),
  }),
});

interface InviteUserFormProps {
  onClose: () => void;
  onRefetch: () => void;
}

const InviteUserForm = ({ onClose, onRefetch }: InviteUserFormProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const toast = useToast();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { activeCustomer } = useCustomer();
  const { data: roleData } = useGetRolesQuery({
    variables: { id: activeCustomer?.id },
    fetchPolicy: 'network-only',
  });

  const selectRoles = roleData?.customer?.roles?.map((role) => ({ label: role.name, value: role.id }));

  const [addUser, { loading: isLoading }] = useMutation(inviteUserMutation, {
    onCompleted: (resData) => {
      const userDidExist = resData?.inviteUser?.didAlreadyExist;
      const didInviteUser = resData?.inviteUser?.didInvite;

      onClose();
      onRefetch();

      if (!userDidExist && didInviteUser) {
        toast({
          title: 'Invited new user!',
          description: 'The user has been invited to the workspace.',
          status: 'success',
          position: 'bottom-right',
          duration: 1500,
        });
      } else if (!didInviteUser && userDidExist) {
        toast({
          title: 'User already exists!',
          description: 'The user already exists in your workspace. Any changes have been applied.',
          status: 'warning',
          position: 'bottom-right',
          duration: 1500,
        });
      } else {
        toast({
          title: 'Existing user added!',
          description: 'User has been added to this workspace.',
          status: 'success',
          position: 'bottom-right',
          duration: 1500,
        });
      }

      setTimeout(() => {
        history.push(`/dashboard/b/${customerSlug}/users/`);
      }, 300);
    },
    onError: (serverError: any) => {
      console.log(serverError);
    },
    refetchQueries: [
      {
        query: getUsersQuery,
        variables: { customerSlug },
      },
    ],
  });

  const handleSubmit = (formData: FormDataProps) => {
    const optionInput = {
      customerId: activeCustomer?.id,
      roleId: formData.role?.value || null,
      email: formData.email || '',
    };

    addUser({
      variables: {
        input: optionInput,
      },
    });
  };

  return (
    <UI.Div>
      <UI.FormSectionHelper mb={1}>
        {t('invite_user_description')}
      </UI.FormSectionHelper>
      <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
        <UI.InputGrid>
          <UI.Div>
            <UI.InputGrid>
              <UI.FormControl isRequired isInvalid={!!form.formState.errors.email}>
                <UI.FormLabel htmlFor="email">{t('email')}</UI.FormLabel>
                <UI.InputHelper>{t('email_helper')}</UI.InputHelper>
                <UI.Input
                  placeholder="Doe"
                  leftEl={<Mail />}
                  {...form.register('email')}
                />
                <FormErrorMessage>{form.formState.errors?.email?.message}</FormErrorMessage>
              </UI.FormControl>
              <UI.Div>
                <UI.FormControl>
                  <UI.FormLabel htmlFor="pgone">{t('role_selector')}</UI.FormLabel>
                  <UI.InputHelper>{t('role_selector_helper')}</UI.InputHelper>
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        options={selectRoles}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </UI.FormControl>
              </UI.Div>

              <UI.Stack isInline>
                <UI.Button
                  isLoading={isLoading}
                  isDisabled={!form.formState.isValid}
                  variantColor="teal"
                  type="submit"
                >
                  Send invite
                </UI.Button>
                <UI.Button variant="outline" onClick={() => onClose()}>Cancel</UI.Button>
              </UI.Stack>
            </UI.InputGrid>
          </UI.Div>
        </UI.InputGrid>
      </UI.Form>
    </UI.Div>
  );
};

export default InviteUserForm;
