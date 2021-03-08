import * as yup from 'yup';
import { MutationFunctionOptions } from '@apollo/client';
import { CreateWorkspaceJobMutation, Exact, GenerateAutodeckInput, CreateWorkspaceJobType, ConfirmWorkspaceJobMutation } from 'types/generated-types';
import { DeepPartial } from 'types/customTypes';

export const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  website: yup.string().required('Website is required'),
  logo: yup.string().url('Url should be valid'),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
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
  textMessage: yup.string()
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