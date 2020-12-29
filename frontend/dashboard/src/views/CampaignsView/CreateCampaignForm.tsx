import * as UI from '@haas/ui';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

type CampaignVariantType = 'SMS' | 'MAIL' | 'QUEUE';

interface CreateCampaignVariantFormProps {
  label: string;
  type: CampaignVariantType;
  dialogueId: string;
  body: string;
  weight: number;
}

interface CreateCampaignFormProps {
  label: string;
  variants: CreateCampaignVariantFormProps[];
}

const createCampaignBodyPlaceholder = `
  Dear {{firstName}},
  thank you for subscribing to {{dialogueId}}!
  Please visit {{dialogueUrl}}.
`;

const mapVariantIndexToLabel: {[key: number]: string} = {
  0: 'A',
  1: 'B',
};

const CreateCampaignForm = () => {
  const form = useForm<CreateCampaignFormProps>({
    defaultValues: {
      label: 'Your new campaign!',
      variants: [{
        type: 'MAIL',
        body: createCampaignBodyPlaceholder,
        weight: 1,
      }],
    },
  });

  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);

  const { t } = useTranslation();

  const { fields: variants, append, insert, move, prepend } = useFieldArray({
    name: 'variants',
    control: form.control,
    keyName: 'variantIndex',
  });

  return (
    <UI.Form>
      <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
        <UI.InputGrid>
          <UI.FormControl isRequired>
            <UI.FormLabel>{t('campaign_label')}</UI.FormLabel>
            <UI.Input name="label" ref={form.register} />
          </UI.FormControl>
          <UI.Div>
            <UI.FormSectionHeader>{t('variants')}</UI.FormSectionHeader>
            {variants.map((variant, index) => (
              <UI.Button key={variant.variantIndex}>
                {`${t('variant')} ${mapVariantIndexToLabel[index]}`}
              </UI.Button>
            ))}
          </UI.Div>
        </UI.InputGrid>
        <UI.Card noHover bg="gray.200">
          <UI.CardBody>
            {`${t('variant')} ${mapVariantIndexToLabel[activeVariantIndex]}`}
          </UI.CardBody>
        </UI.Card>
      </UI.Grid>
    </UI.Form>
  );
};

export default CreateCampaignForm;
