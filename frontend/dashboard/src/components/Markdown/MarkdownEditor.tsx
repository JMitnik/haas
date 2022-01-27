import React from 'react';
import * as UI from '@haas/ui';
import 'easymde/dist/easymde.min.css';
import styled, { css } from 'styled-components';
import SimpleMDE from 'react-simplemde-editor';

interface MarkdownEditorOptions {
  hideStatus?: boolean;
  maxHeight?: number;
}

const defaultMarkdownEditorOptions: MarkdownEditorOptions = {
  hideStatus: true,
  maxHeight: 130,
}

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  options?: MarkdownEditorOptions;
}

export const MarkdownEditorContainer = styled(UI.Div)`
  ${({ theme }) => css`
    .EasyMDEContainer {
      border-radius: 5px;
      background: white;
    }

    .editor-toolbar {
      background: white;
      border-radius: 5px 5px 0 0;
      border: 1px solid ${theme.colors.gray[300]};
      border-width: 1px 1px 0 1px;
    }

    .CodeMirror {
      border: 1px solid ${theme.colors.gray[300]};
      border-radius: 0 0 5px 5px;
      font-family: 'Inter', sans-serif;
    }

    .editor-statusbar {
      display: none;
    }
  `}
`;

export const MarkdownEditor = ({ value, onChange, options = defaultMarkdownEditorOptions }: MarkdownEditorProps) => (
  <MarkdownEditorContainer>
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={{
        status: options.hideStatus,
        maxHeight: `${options.maxHeight}px`,
        toolbar: ['bold', 'italic', 'preview'],
      }}
    />
  </MarkdownEditorContainer>
)
