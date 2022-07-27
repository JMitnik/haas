import * as UI from '@haas/ui';
import { Controller, useForm } from 'react-hook-form';
import { isPresent } from 'ts-is-present';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Loader } from 'components/Common/Loader/Loader';
import { SystemPermission, useFindRoleByIdQuery, useUpdatePermissionsMutation } from 'types/generated-types';

interface RoleUserModalCardProps {
  id: string;
  userId: string;
  onClose: () => void;
}

interface RoleUserFormProps {
  allPermissions?: SystemPermission[];
  permissionsState?: PermissionsType[];
  permissionsArray?: SystemPermission[];
  roleId: string;
  onClose: () => void;
}

interface PermissionsType {
  permission: SystemPermission;
  isActive: boolean;
}

const RoleUserForm = ({
  permissionsState,
  allPermissions,
  permissionsArray,
  roleId,
  onClose,
}: RoleUserFormProps) => {
  const { t } = useTranslation();
  const toast = useToast();

  const [updatePermissions, { loading }] = useUpdatePermissionsMutation({
    onCompleted: () => {
      onClose();
      toast({
        title: t('toast:updated_permissions'),
        description: t('toast:updated_permissions_helper'),
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
      <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}>
        {allPermissions?.map((permission) => (
          <Controller
            control={control}
            name={permission as any}
            defaultValue={permissionsArray?.includes(permission)}
            key={permission}
            render={({ field }) => (
              <UI.CheckboxCard
                value={field.value}
                key={permission}
                onChange={() => permission !== 'CAN_ACCESS_ADMIN_PANEL' && field.onChange(!field.value)}
                isDisabled={permission === 'CAN_ACCESS_ADMIN_PANEL'}
                title={permission.replaceAll('_', ' ')}
                description={t(`permissions:${permission.toLowerCase()}`)}
              />
            )}
          />
        ))}
      </UI.Grid>

      <UI.Flex justifyContent="flex-end" mt={4}>
        <UI.Button isLoading={loading} variantColor="main" type="submit">
          {t('save')}
        </UI.Button>
      </UI.Flex>
    </form>
  );
};

/**
 * A modal used to display information of a user role after it being clicked on in the UsersOverview
 *
 * Note:
 * - Permissions that are derived from global permissions could be checked,
 * but they are not "disabled" yet in the Database.
 *
 * @param object with an unique identifier as well as a onClose function to close the modal
 * @returns a pop-up modal displaying User role specific information, on this modal is a form where u can set the
 * permissions of a selected role
 */
const RoleUserModalCard = ({ id, userId, onClose }: RoleUserModalCardProps) => {
  const { t } = useTranslation();
  const { data, loading, error } = useFindRoleByIdQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        roleId: id,
        userId,
      },
    },
  });

  const role = data?.role;

  // if (loading) {
  //   return <UI.Loader />;
  // }

  const permissions: PermissionsType[] = role?.allPermissions?.map((permission) => ({
    isActive: role?.permissions?.includes(permission) || false,
    permission: permission!,
  })) || [];

  return (
    <>
      <UI.ModalHead>
        <UI.ModalTitle>
          {t('role_permissions')}
          {' '}
          -
          {' '}
          {role?.name}
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        {error && (
          <UI.ErrorPane header="Server Error" text={error.message} />
        )}
        {loading && (
          <Loader testId="haas-runner" />
        )}

        {!loading && (
          <RoleUserForm
            permissionsState={permissions}
            allPermissions={role?.allPermissions?.filter(isPresent)}
            permissionsArray={role?.permissions?.filter(isPresent) || []}
            roleId={id}
            onClose={onClose}
          />
        )}
      </UI.ModalBody>
    </>
  );
};

export default RoleUserModalCard;
