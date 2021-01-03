import * as yup from 'yup';
import * as UI from '@haas/ui';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileDropInput from 'components/FileDropInput';
import { useToast } from '@chakra-ui/core';
import { useCreateBatchDeliveriesMutation, refetchGetWorkspaceCampaignQuery } from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';
import { campaignViewFilter } from './CampaignView';

const schema = yup.object({}).required();

type FormProps = yup.InferType<typeof schema>;

export const ImportDeliveriesForm = ({ onClose }: { onClose: () => void; }) => {
  const { campaignId } = useNavigator();
  const form = useForm<FormProps>();

  const { customerSlug } = useNavigator();

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
    refetchQueries: [
      refetchGetWorkspaceCampaignQuery({
        customerSlug, campaignId,
        deliveryConnectionFilter: campaignViewFilter
      })
    ]
  })

  const handleDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    setActiveCSV(file);
  };

  const handleSubmit = () => {
    importDeliveries({
      variables: {
        input: {
          campaignId: campaignId,
          batchScheduledAt: new Date().toISOString(),
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
        <FileDropInput 
          onDrop={handleDrop}
        />

      </UI.InputGrid>
      <UI.Button type="submit">{t('save')}</UI.Button>
    </UI.Form>
  )
};