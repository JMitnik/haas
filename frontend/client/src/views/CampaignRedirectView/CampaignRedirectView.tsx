import * as Sentry from '@sentry/react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { DeliveryStatusEnum, useGetDeliveryQuery, useUpdateDeliveryStatusMutation } from 'types/generated-types';
import { useGetUrlRef } from 'hooks/useGetUrlRef';
import Loader from 'components/Loader';

export const CampaignRedirectView = () => {
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);
  const ref = useGetUrlRef();

  const { data } = useGetDeliveryQuery({
    skip: !ref,
    variables: {
      deliveryId: ref,
    },
  });

  const [updateDelivery, { called }] = useUpdateDeliveryStatusMutation({
    variables: {
      deliveryId: ref,
      status: DeliveryStatusEnum.Opened,
    },
    onCompleted: () => {
      setRedirect(true);
    },
    onError: (error) => {
      Sentry.captureException(error);
      setRedirect(true);
    },
  });

  useEffect(() => {
    if (ref && !called && data?.delivery?.campaignVariant) {
      updateDelivery();
    }
  }, [ref, called, data, updateDelivery]);

  const url = `/${data?.delivery?.campaignVariant?.workspace?.slug}/${data?.delivery?.campaignVariant?.dialogue?.slug}`;

  if (redirect) {
    return (
      <motion.div exit={{ opacity: 0 }}>
        <Navigate to={{
          pathname: url,
          search: location.search,
        }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div exit={{ opacity: 0 }}>
      <Loader />
    </motion.div>
  );
};