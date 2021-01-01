import * as yup from 'yup';
import * as UI from '@haas/ui';
import { useGetWorkspaceCampaigns } from 'hooks/useGetWorkspaceCampaigns';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import FileDropInput from 'components/FileDropInput';
import { useToast } from '@chakra-ui/core';

const schema = yup.object({
  label: yup.string().required(),
  campaign: yup.object().shape({
    label: yup.string(),
    value: yup.string()
  }).required(),
}).required();

type FormProps = yup.InferType<typeof schema>;

const IMPORT_DELIVERIES_MUTATION = gql`
  mutation createBatchDeliveries($input: CreateBatchDeliveriesInputType) {
    createBatchDeliveries(input: $input) {
      nrDeliveries
      failedDeliveries {
        record
        error
      }
    }
  }
`;

export const ImportDeliveriesForm = ({ onClose }: { onClose: () => void; }) => {
  const form = useForm<FormProps>({
    defaultValues: {
      label: '',
      campaign: undefined,
    }
  });

  const toast = useToast();

  const { campaigns } = useGetWorkspaceCampaigns();
  const [activeCSV, setActiveCSV] = useState<File | null>(null);
  const [importDeliveries] = useMutation(IMPORT_DELIVERIES_MUTATION, {
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
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'Currently unable to edit your detail. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
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
          label: formData.label,
          campaignId: formData.campaign.value,
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
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="label">{t('label')}</UI.FormLabel>
          <UI.Input name="label" ref={form.register} id="label" />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor="campaign">{t('campaign')}</UI.FormLabel>
          <Controller
            name="campaign"
            control={form.control}
            render={({ onBlur, onChange, value }) => (
              <Select
                options={campaigns.map((campaign: any) => ({
                  label: campaign.label,
                  value: campaign.id,
                }))}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
        </UI.FormControl>

        <FileDropInput 
          onDrop={handleDrop}
        />

      </UI.InputGrid>
      <UI.Button type="submit">{t('save')}</UI.Button>
    </UI.Form>
  )
};