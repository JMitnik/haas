import * as UI from '@haas/ui';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Checkbox, useToast } from '@chakra-ui/core';
import { SystemPermission, useFindRoleByIdQuery, useUpdatePermissionsMutation } from 'types/generated-types';

interface RoleUserModalCardProps {
  id: string;
  onClose: () => void;
}

interface RoleUserFormProps {
  allPermissions?: Array<SystemPermission>
  permissionsState?: Array<PermissionsType>
  permissionsArray?: Array<SystemPermission>
  roleId: string;
  onClose: () => void;
}

interface PermissionsType {
  permission: SystemPermission;
  isActive: boolean;
}

const RoleUserForm = ({ permissionsState, allPermissions, permissionsArray, roleId, onClose }: RoleUserFormProps) => {
  const { t } = useTranslation();
  const toast = useToast();

  const [updatePermissions] = useUpdatePermissionsMutation({
    onCompleted: (data) => {
      console.log('Return data: ', data);
      onClose();
      toast({
        title: 'Updated permissions',
        description: 'Role has been updated with new permissions!',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const { handleSubmit, control } = useForm({
    defaultValues: {
      activePermissions: permissionsState,
      allPermissions,
      permissionsArray,
    },
  });

  const onSubmit = (data: any) => {
    const filteredPermissions = Object.entries(data).filter((entry) => entry[1] === true).map((entry) => entry[0]);
    updatePermissions({
      variables: {
        input: {
          roleId,
          permissions: filteredPermissions as SystemPermission[],
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <UI.Grid gridTemplateColumns="1fr 1fr">
        {allPermissions?.map((permission) => (
          <Controller
            control={control}
            name={permission}
            defaultValue={permissionsArray?.includes(permission)}
            key={permission}
            render={({ onChange, value }) => (
              <Checkbox
                isChecked={value}
                onChange={() => onChange(!value)}
              >
                {permission}
              </Checkbox>
            )}
          />
        ))}
      </UI.Grid>

      <UI.Flex justifyContent="flex-end">
        <UI.Button variantColor="teal" type="submit">
          {t('save')}
        </UI.Button>
      </UI.Flex>

    </form>
  );
};

/**
 * A modal used to display information of a user role after it being clicked on in the UsersOverview
 * @param object with an unique identifier as well as a onClose function to close the modal
 * @returns a pop-up modal displaying User role specific information, on this modal is a form where u can set the
 * permissions of a selected role
 */
export const RoleUserModalCard = ({ id, onClose }: RoleUserModalCardProps) => {
  const { t } = useTranslation();
  const { data, loading, error } = useFindRoleByIdQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        roleId: id,
      },
    },
  });

  const userOfCustomer = data?.findRoleById;

  if (loading) {
    return <UI.Loader />;
  }

  const perms: Array<PermissionsType> = userOfCustomer?.allPermissions?.map((perm) => ({
    isActive: userOfCustomer?.role?.permissions?.includes(perm) || false,
    permission: perm,
  })) || [];

  return (
    <UI.ModalCard onClose={onClose}>
      <UI.ModalHead>
        <UI.ModalTitle>{t('details')}</UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        {error && (
          <UI.ErrorPane header="Server Error" text={error.message} />
        )}
        <RoleUserForm
          permissionsState={perms}
          allPermissions={userOfCustomer?.allPermissions}
          permissionsArray={userOfCustomer?.role?.permissions || []}
          roleId={id}
          onClose={onClose}
        />

      </UI.ModalBody>
    </UI.ModalCard>
  );
};

export default RoleUserModalCard;
