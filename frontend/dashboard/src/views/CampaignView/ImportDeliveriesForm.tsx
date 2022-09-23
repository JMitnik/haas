import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { useCreateBatchDeliveriesMutation } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import { useLogger } from 'hooks/useLogger';
import { useNavigator } from 'hooks/useNavigator';
import FileDropInput from 'components/FileDropInput';

const schema = yup.object({
  batchScheduledAt: yup.date(),
}).required();

type FormProps = yup.InferType<typeof schema>;

interface ImportDeliveriesFormProps {
  onClose: () => void;
  onComplete?: () => void;
}

export const ImportDeliveriesForm = ({ onClose, onComplete }: ImportDeliveriesFormProps) => {
  const { campaignId } = useNavigator();
  const form = useForm<FormProps>({
    defaultValues: {
      batchScheduledAt: new Date(),
    },
    mode: 'all',
  });
  const { activeCustomer } = useCustomer();
  const logger = useLogger();
  const { t } = useTranslation();

  const toast = useToast();

  const [activeCSV, setActiveCSV] = useState<File | null>(null);
  const [importDeliveries] = useCreateBatchDeliveriesMutation({
    onCompleted: () => {
      toast({
        title: t('toast:delivery_imported'),
        description: t('toast:delivery_imported_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      onComplete?.();
      onClose();
    },
    onError: (error) => {
      logger.logError(error, {
        tags: { section: 'campaign' },
      });
      toast({
        title: 'Something went wrong!',
        description: 'Currently unable to edit your detail. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const handleDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    setActiveCSV(file);
  };

  const handleSubmit = (formData: FormProps) => {
    importDeliveries({
      variables: {
        input: {
          workspaceId: activeCustomer?.id,
          campaignId,
          batchScheduledAt: (formData.batchScheduledAt as Date).toISOString(),
          uploadedCsv: activeCSV,
        },
      },
    });
  };

  return (
    <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
      <UI.FormSectionHeader>{t('import_deliveries')}</UI.FormSectionHeader>

      <UI.InputGrid>
        <UI.FormControl isRequired>
          <UI.FormLabel>{t('upload_deliveries')}</UI.FormLabel>
          <UI.FormLabelHelper>{t('upload_deliveries_helper')}</UI.FormLabelHelper>
          <FileDropInput
            onDrop={handleDrop}
          />
        </UI.FormControl>

        {/* TODO: implement new date picker as this antd variant is not supported anymore */}
        {/* <UI.FormControl isRequired>
          <UI.FormLabel>{t('scheduled_at')}</UI.FormLabel>
          <UI.FormLabelHelper>{t('scheduled_at_helper')}</UI.FormLabelHelper>
          <UI.Div>
            <Controller
              name="batchScheduledAt"
              control={form.control}
              render={({ field }) => (
                <UI.DatePicker
                  defaultValue={field.value}
                  format="DD-MM-YYYY HH:mm"
                  onChange={field.onChange}
                  showTime={{
                    format: 'HH:mm',
                    hourStep: 1,
                    minuteStep: 15,
                  }}
                />
              )}
            />
          </UI.Div>
        </UI.FormControl> */}

      </UI.InputGrid>
      <UI.Button
        mt={4}
        type="submit"
        isDisabled={!form.formState.isValid}
      >
        {t('save')}
      </UI.Button>
    </UI.Form>
  );
};
