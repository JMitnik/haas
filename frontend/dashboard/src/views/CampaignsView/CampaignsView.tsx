import * as UI from '@haas/ui';
import { Controller, useForm } from 'react-hook-form';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

const CampaignsView = () => {
  const form = useForm();
  const { t } = useTranslation();
  const [openedModal, setIsOpenedModal] = useState(false);

  return (
    <UI.ViewContainer>
      <UI.PageTitle>{t('campaigns')}</UI.PageTitle>
      <UI.Button onClick={() => setIsOpenedModal(true)} variantColor="teal" leftIcon={Plus}>{t('create_campaign')}</UI.Button>
      {/* TODO: Set proper close */}
      <UI.Modal isOpen={openedModal} onClose={() => setIsOpenedModal(false)}>
        <UI.Card noHover bg="white">
          <UI.CardBody>
            <UI.Form>
              <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <UI.InputGrid>
                  <UI.FormControl isRequired>
                    <UI.FormLabel>{t('name')}</UI.FormLabel>
                    <UI.Input name="name" ref={form.register} />
                  </UI.FormControl>

                  <UI.FormControl isRequired>
                    <Controller
                      name="type"
                      control={form.control}
                      render={({ value, onBlur, onChange }) => (
                        <UI.RadioButtons onBlur={onBlur} onChange={onChange} value={value}>
                          <UI.RadioButton text="SMS" value="SMS" />
                          <UI.RadioButton text="Mail" value="Mail" />
                          <UI.RadioButton text="Both" value="Both" />
                        </UI.RadioButtons>
                      )}
                    />
                  </UI.FormControl>
                </UI.InputGrid>
                <UI.Div>
                  Test
                </UI.Div>
              </UI.Grid>
            </UI.Form>
          </UI.CardBody>
        </UI.Card>
      </UI.Modal>
    </UI.ViewContainer>
  );
};

export default CampaignsView;
