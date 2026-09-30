import { tags as t } from '@lezer/highlight'
import { createTheme } from '@uiw/codemirror-themes'

/** CodeMirror theme using the VS Code 2026 Dark colours (see theme/tokens.css). */
export const editorTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#121314',
    foreground: '#bbbebf',
    caret: '#48a0c7',
    selection: '#276782dd',
    selectionMatch: '#276782aa',
    lineHighlight: '#ffffff0a',
    gutterBackground: '#121314',
    gutterForeground: '#858889',
    gutterBorder: 'transparent',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  styles: [
    { tag: [t.keyword, t.operatorKeyword], color: '#569cd6' },
    { tag: [t.string, t.special(t.string)], color: '#ce9178' },
    { tag: [t.number, t.bool, t.null], color: '#b5cea8' },
    { tag: [t.comment, t.lineComment, t.blockComment], color: '#6a9955', fontStyle: 'italic' },
    { tag: [t.typeName, t.standard(t.typeName)], color: '#4ec9b0' },
    { tag: [t.name, t.variableName, t.propertyName], color: '#9cdcfe' },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#dcdcaa' },
    { tag: [t.operator, t.punctuation, t.paren], color: '#bbbebf' },
  ],
})
