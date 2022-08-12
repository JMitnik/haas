import * as UI from '@haas/ui';
import React from 'react';

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
  form: any;
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
    steps: {
      header?: string;
      helper?: string;
      subHelper?: string;
      type?: string;
      fields: {
        id?: string;
        placeholder: string;
        label: string;
        type: string;
        isRequired: boolean;
        position: number;
        contact?: {
          contacts: {
            label: string;
            value: string;
            type: string;
          }[]
        }
      }[];
    }[];
    fields: {
      id?: string;
      placeholder: string;
      label: string;
      type: string;
      isRequired: boolean;
      position: number;
      contact?: {
        contacts: {
          label: string;
          value: string;
          type: string;
        }[]
      }
    }[];
  };
}

interface LinkSectionHeaderProps {
  title: string;
}

export const LinkSectionHeader = ({ title }: LinkSectionHeaderProps) => (
  <UI.Div style={{ fontSize: '1.5em' }} gridColumn="1/-1">
    <UI.Div>{title}</UI.Div>
    <UI.Hr style={{ padding: '0px' }} />
  </UI.Div>
);
