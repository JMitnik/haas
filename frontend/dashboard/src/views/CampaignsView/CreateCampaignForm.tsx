import * as UI from '@haas/ui';
import * as yup from 'yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React, { useState } from 'react';

import { ReactComponent as DecideIll } from 'assets/images/undraw_decide.svg';

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

const mapVariantIndexToLabel: { [key: number]: string } = {
  0: 'A',
  1: 'B',
};

const schema = yup.object({
  label: yup.string().required(),
});

const CreateCampaignForm = () => {
  const form = useForm<CreateCampaignFormProps>({
    defaultValues: {
      label: '',
      variants: [
        {
          type: 'MAIL',
          body: createCampaignBodyPlaceholder,
          weight: 0.5,
        },
        {
          type: 'MAIL',
          body: createCampaignBodyPlaceholder,
          weight: 0.5,
        },
      ],
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null);

  const switchActiveVariant = (index: number) => {
    setActiveVariantIndex(index);
  };

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
            <UI.FormLabel htmlFor="label">{t('campaign_label')}</UI.FormLabel>
            <UI.Input name="label" id="label" ref={form.register} />
          </UI.FormControl>
          <UI.Div>
            <UI.InputHeader>{t('variants')}</UI.InputHeader>
            <UI.InputHelper>{t('variants_helper')}</UI.InputHelper>
            <UI.Stack spacing={2}>
              {variants.map((variant, index) => (
                <UI.ButtonCard
                  onClick={() => switchActiveVariant(index)}
                  isActive={activeVariantIndex === index}
                  bg="white"
                  key={variant.variantIndex}
                >
                  {`${t('variant')} ${mapVariantIndexToLabel[index]}`}
                </UI.ButtonCard>
              ))}
            </UI.Stack>
          </UI.Div>
        </UI.InputGrid>
        <UI.Card noHover bg="gray.100">
          {(activeVariantIndex === 0 || activeVariantIndex) ? (
            <UI.CardBody>
              {`${t('variant')} ${mapVariantIndexToLabel[activeVariantIndex]}`}
            </UI.CardBody>
          ) : (
            <UI.IllustrationCard
              svg={<DecideIll />}
              text={t('select_a_variant')}
              isFlat
            />
          )}
        </UI.Card>
        <UI.Button type="submit" isDisabled={!form.formState.isValid}>
          {t('save')}
        </UI.Button>
      </UI.Grid>
    </UI.Form>
  );
};

export default CreateCampaignForm;
