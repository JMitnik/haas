import * as UI from '@haas/ui';
import { useGetWorkspaceCampaign } from 'hooks/useGetWorkspaceCampaign';
import { useNavigator } from 'hooks/useNavigator';
import React, { useState } from 'react';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

export const CampaignView = () => {
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const { t } = useTranslation();
  
  const { campaignId, getCampaignsPath } = useNavigator();
  const campaignsPath = getCampaignsPath();
  const { campaign } = useGetWorkspaceCampaign({ campaignId });
  
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
        <div>{campaign?.label}</div>

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
            
            <UI.TableRow>
              
            </UI.TableRow>
          </UI.TableBody>
        </UI.Table>

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