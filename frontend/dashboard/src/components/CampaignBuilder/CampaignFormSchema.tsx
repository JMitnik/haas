import * as yup from 'yup';

export const campaignFormSchema = yup.object({
  variant: yup.object({
    label: yup.string().required().min(3),
  })
});

export type CampaignFormType = yup.InferType<typeof campaignFormSchema>;
