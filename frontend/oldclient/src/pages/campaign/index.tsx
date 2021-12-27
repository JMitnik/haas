import * as Sentry from '@sentry/react';
import { Redirect, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { DeliveryStatusEnum, useGetDeliveryQuery, useUpdateDeliveryStatusMutation } from 'types/generated-types';
import { useGetUrlRef } from 'hooks/useGetUrlRef';
import CustomerOverview from 'views/CustomerOverview/CustomerOverview';
import Loader from 'components/Loader';

export const CampaignRedirect = () => {
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

  if (!ref) {
    return (
      <motion.div exit={{ opacity: 0 }}>
        <CustomerOverview />
      </motion.div>
    );
  }

  const url = `/${data?.delivery?.campaignVariant?.workspace.slug}/${data?.delivery?.campaignVariant?.dialogue.slug}`;

  if (redirect) {
    return (
      <motion.div exit={{ opacity: 0 }}>
        <Redirect to={{
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
