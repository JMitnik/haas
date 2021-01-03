import * as UI from '@haas/ui';
import { useNavigator } from 'hooks/useNavigator';
import React, { useState } from 'react';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { DeliveryConnectionFilter, useGetWorkspaceCampaignQuery } from 'types/generated-types';
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

export const campaignViewFilter: DeliveryConnectionFilter = {
  paginationFilter: {
    limit: 10
  }
};

const POLL_INTERVAL_SECONDS = 60;
const POLL_INTERVAL = POLL_INTERVAL_SECONDS * 1000;

export const CampaignView = () => {
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const { t } = useTranslation();
  
  const { customerSlug, campaignId, getCampaignsPath } = useNavigator();
  const campaignsPath = getCampaignsPath();

  const { data } = useGetWorkspaceCampaignQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      campaignId,
      customerSlug,
      deliveryConnectionFilter: campaignViewFilter,
    },
    pollInterval: POLL_INTERVAL
  });

  const campaign = data?.customer?.campaign;
  const deliveryConnection = campaign?.deliveryConnection;

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <UI.PageTitle>{campaign?.label}</UI.PageTitle>
            <UI.Button 
              leftIcon={Plus}
            onClick={() => setIsOpenImportModal(true)} size="sm" variantColor="teal">{t('import_deliveries')}</UI.Button>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <UI.Card noHover p={2}>
          <UI.Table>
            <UI.TableHeading>
              <UI.TableHeadingCell>
                {t('recipient')}
              </UI.TableHeadingCell>
              <UI.TableHeadingCell>
                {t('recipient_adress')}
              </UI.TableHeadingCell>
              <UI.TableHeadingCell>
                {t('status')}
              </UI.TableHeadingCell>
            </UI.TableHeading>

            <UI.TableBody>
              {deliveryConnection?.deliveries.map(delivery => (
                <UI.TableRow key={delivery.id}>
                  <UI.TableCell>
                    {delivery?.deliveryRecipientFirstName}
                  </UI.TableCell>
                  <UI.TableCell>
                    {delivery?.deliveryRecipientEmail}
                  </UI.TableCell>
                  <UI.TableCell>
                    <UI.Label>
                      {delivery?.currentStatus}
                    </UI.Label>
                  </UI.TableCell>
                </UI.TableRow>
              ))}
            </UI.TableBody>
          </UI.Table>
        </UI.Card>

        <UI.Modal isOpen={isOpenImportModal} onClose={() => setIsOpenImportModal(false)}>
          <UI.Card bg="white" noHover width={700}>
            <UI.CardBody>
              <ImportDeliveriesForm 
              onClose={() => setIsOpenImportModal(false)} />
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>
      </UI.ViewContainer>
    </>
  )
};