import * as yup from 'yup';

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