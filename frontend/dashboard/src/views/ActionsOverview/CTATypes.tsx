import { UseFormMethods } from 'react-hook-form';

export interface LinkInputProps {
  id?: string | null;
  title: string;
  type?: { label: string, value: string } | null;
  url: string;
  iconUrl?: string;
  backgroundColor?: string;
  header?: string;
  subHeader?: string;
  uploadImage?: string;
  imageUrl?: string;
  buttonText?: string;
}

export interface CTANodeFormProps {
  form: UseFormMethods<FormDataProps>;
}

export interface FormDataProps {
  title: string;
  ctaType: { label: string, value: string };
  links: Array<{
    id?: string | null;
    title: string;
    type?: string | null;
    url: string;
    iconUrl?: string;
    backgroundColor?: string;
    header?: string;
    subHeader?: string;
    imageUrl?: string;
    buttonText?: string;
  }>;
  share: { id?: string, tooltip: string, url: string, title: string };
  formNode?: {
    id?: string;
    helperText?: string;
    fields: {
      id?: string;
      placeholder: string;
      label: string;
      type: string;
      isRequired: boolean;
      position: number;
    }[];
  };
}
