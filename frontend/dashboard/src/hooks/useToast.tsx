import { useToast as useChakraToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';

interface ToastInput {
  title?: string;
  description?: string;
}

export const useToast = () => {
  const { t } = useTranslation();
  const chakraToast = useChakraToast();

  const toast = {
    ...chakraToast,
    success: ({ title = t('toast:general_success'), description = t('toast:general_success_helper') }: ToastInput) => {
      chakraToast({
        title,
        description,
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    templates: {
      error: () => {
        chakraToast({
          title: t('toast:general_error'),
          description: t('toast:general_error_helper'),
          status: 'error',
          position: 'bottom-right',
          duration: 1500,
        });
      },
    },
  };

  return toast;
};
