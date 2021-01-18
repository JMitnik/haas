import * as yup from 'yup';
import * as UI from '@haas/ui';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileDropInput from 'components/FileDropInput';
import { useToast } from '@chakra-ui/core';
import { useCreateBatchDeliveriesMutation, refetchGetWorkspaceCampaignQuery } from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';
// import { defaultCampaignViewFilter } from './AutodeckOverview';
import { useCustomer } from 'providers/CustomerProvider';
import { useRef } from 'react';

const schema = yup.object({
  batchScheduledAt: yup.date()
}).required();

type FormProps = yup.InferType<typeof schema>;

export const ImportDeliveriesForm = ({ onClose }: { onClose: () => void; }) => {
  const { campaignId, customerSlug } = useNavigator();
  const form = useForm<FormProps>({
    defaultValues: {
      batchScheduledAt: new Date()
    },
    mode: 'all'
  });
  const { activeCustomer } = useCustomer();

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

      onClose();
    },
    awaitRefetchQueries: true,
    onError: (error) => {
      console.log(error);
      toast({
        title: 'Something went wrong!',
        description: 'Currently unable to edit your detail. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    // refetchQueries: [
    //   refetchGetWorkspaceCampaignQuery({
    //     customerSlug, campaignId,
    //     deliveryConnectionFilter: defaultCampaignViewFilter
    //   })
    // ]
  })

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
        }
      }
    })
  }

  const { t } = useTranslation();

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

        <UI.FormControl isRequired>
          <UI.FormLabel>{t('scheduled_at')}</UI.FormLabel>
          <UI.FormLabelHelper>{t('scheduled_at_helper')}</UI.FormLabelHelper>
          <UI.Div>
            <Controller
              name="batchScheduledAt"
              control={form.control}
              render={({ onChange, value }) => (
                <UI.DatePicker
                  defaultValue={value}
                  format="DD-MM-YYYY HH:mm"
                  onChange={onChange}
                  showTime={{
                    format: "HH:mm",
                    hourStep: 1,
                    minuteStep: 15,
                  }}
                />
              )}
            />
          </UI.Div>
        </UI.FormControl>

      </UI.InputGrid>
      <UI.Button
        type="submit"
        isDisabled={!form.formState.isValid}
      >{t('save')}</UI.Button>
    </UI.Form>
  )
};