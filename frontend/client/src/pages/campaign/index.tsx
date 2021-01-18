import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import * as Sentry from '@sentry/react';

import Loader from 'components/Loader';
import { useGetUrlRef } from 'hooks/useGetUrlRef';
import { DeliveryStatusEnum, useGetDeliveryQuery, useUpdateDeliveryStatusMutation } from 'types/generated-types';
import CustomerOverview from 'views/CustomerOverview/CustomerOverview';

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
      status: DeliveryStatusEnum.Opened
    },
    onCompleted: () => {
      setRedirect(true);
    }, onError: (error) => {
      Sentry.captureException(error);
      setRedirect(true);
    }
  })

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

  if (redirect) {
    return (
      <motion.div exit={{ opacity: 0 }}>
        <Redirect to={{
          pathname: `/${data?.delivery?.campaignVariant.workspace.slug}/${data?.delivery?.campaignVariant.dialogue.slug}`,
          search: location.search
        }} />
      </motion.div>
    );
  }

  return (
    <motion.div exit={{ opacity: 0 }}>
      <Loader />
    </motion.div>
  );
};
