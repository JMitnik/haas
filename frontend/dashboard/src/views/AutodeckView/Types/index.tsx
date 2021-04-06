import * as yup from 'yup';
import { MutationFunctionOptions } from '@apollo/client';
import { CreateWorkspaceJobMutation, Exact, GenerateAutodeckInput, CreateWorkspaceJobType, ConfirmWorkspaceJobMutation } from 'types/generated-types';
import { DeepPartial } from 'types/customTypes';

export const schema = yup.object().shape({
  name: yup.string(),
  customFields: yup.array().required().of(yup.object().nullable().notRequired().shape({
    key: yup.string().nullable(),
    value: yup.string().nullable(),
  }).nullable()).notRequired(),
  newCustomFields: yup.array().required().of(yup.object().nullable().notRequired().shape({
    key: yup.string().required().matches(/^[a-zA-Z]*$/, {
      message: 'Only alphabetic characters are accepted as key!',
    }),
    value: yup.string().required(),
  }).nullable()).notRequired(),
  jobLocation: yup.object().shape({
    value: yup.string().required(),
    label: yup.string().required()
  }).required(),
  website: yup.string().notRequired(),
  logo: yup.string().url('Url should be valid'),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
  isGenerateWorkspace: yup.number(),
  slug: yup.string(),
  useRembg: yup.number(),
  useCustomUrl: yup.number(),
  useCustomColour: yup.number(),
  useWebsiteUrl: yup.number(),
  isEditingLogo: yup.number(),
  isWebsiteUrlApproved: yup.number(),
  isLogoUrlApproved: yup.number(),
  uploadLogo: yup.string().url(),
  adjustedLogo: yup.string().url(),
  firstName: yup.string(),
  companyName: yup.string(),
  answer1: yup.string(),
  answer2: yup.string(),
  answer3: yup.string(),
  answer4: yup.string(),
  sorryAboutX: yup.string(),
  youLoveX: yup.string(),
  reward: yup.string(),
  emailContent: yup.string(),
  textMessage: yup.string(),
}).required();

export type FormDataProps = yup.InferType<typeof schema>;

export interface AutodeckFormProps {
  onClose: () => void;
  isLoading: boolean;
  onCreateJob: (options?: MutationFunctionOptions<CreateWorkspaceJobMutation, Exact<{
    input?: GenerateAutodeckInput | null | undefined;
  }>> | undefined) => Promise<any>;
  job: DeepPartial<CreateWorkspaceJobType> | null;
  isInEditing: boolean;
  onConfirmJob: (options?: MutationFunctionOptions<ConfirmWorkspaceJobMutation, Exact<{
    input?: GenerateAutodeckInput | null | undefined;
  }>> | undefined) => Promise<any>;
  isConfirmLoading: boolean;
}