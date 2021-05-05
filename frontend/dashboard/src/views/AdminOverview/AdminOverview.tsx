import * as UI from '@haas/ui';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import React, { useCallback, useEffect, useState } from 'react';

import { Div, Flex, PageTitle, Text } from '@haas/ui';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';

const AdminOverview = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <PageTitle>{t('views:admin_overview')}</PageTitle>
    </>
  );
};

export default AdminOverview;
