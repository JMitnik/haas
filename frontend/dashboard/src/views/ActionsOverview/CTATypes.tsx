import { UseFormMethods } from 'react-hook-form';

export interface CTANodeFormProps {
  form: UseFormMethods<FormDataProps>;
}

export interface FormDataProps {
  title: string;
  ctaType: { label: string, value: string };
  links: Array<{id?: string | null;
    title: string;
    type?: string;
    url: string;
    tooltip?: string;
    iconUrl?: string;
    backgroundColor?: string;}>;
  share: { id?: string, tooltip: string, url: string, title: string };
  formNode?: {
    id?: string;
    fields: {
      id?: string;
      label: string;
      type: string;
      isRequired: boolean;
      position: number;
    }[];
  };
}
