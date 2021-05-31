import * as UI from '@haas/ui';
import { yupResolver } from '@hookform/resolvers';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { campaignFormSchema } from './CampaignFormSchema';


interface CampaignFormProps {
  label?: string | null;
  onChange: (formValues: any) => void;
}

export const CampaignForm = ({ label, onChange }: CampaignFormProps) => {
  const { t } = useTranslation();
  const form = useForm({
    resolver: yupResolver(campaignFormSchema),
    defaultValues: {
      label
    }
  });

  const formValues = form.watch();

  useEffect(() => {
    onChange(formValues);
  }, [formValues]);

  return (
    <UI.Stack>
      <UI.Div border="1px solid" borderColor="gray.400" padding={4} borderRadius={5}>
        <UI.Div mb={4}>
          <UI.Helper>About your Campaign</UI.Helper>
        </UI.Div>
        <UI.FormControl isRequired>
          <UI.FormControl>
            <UI.FormLabel htmlFor="label">{t('label')}</UI.FormLabel>
            <UI.Input
              ref={form.register()}
              size="sm"
              name="label"
              defaultValue={label || ''}
            />
          </UI.FormControl>
        </UI.FormControl>
      </UI.Div>
    </UI.Stack>
  )
}