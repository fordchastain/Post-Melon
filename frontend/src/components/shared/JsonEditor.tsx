import React from 'react';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { jsonLanguage } from '@codemirror/lang-json';

type JsonEditorProps = {
  json: string;
  updateJson: (newJson: string) => void;
  readonly?: boolean;
};

const JsonEditor: React.FC<JsonEditorProps> = ({ json, updateJson, readonly = false }) => {
  return (
    <CodeMirror
      value={json}
      extensions={[jsonLanguage]}
      onChange={(value) => updateJson(value)}
      basicSetup={{
        lineNumbers: true,
        autocompletion: false,
        lintKeymap: true,
      }}
      style={{
        borderRadius: 8,
        fontSize: '14px',
        fontFamily: 'monospace',
      }}
      editable={!readonly}
    />
  );
};

export default JsonEditor;
