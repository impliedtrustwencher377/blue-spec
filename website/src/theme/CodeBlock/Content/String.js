/*
 * Swizzled from @docusaurus/theme-classic to default the "Toggle word wrap"
 * button to on. The upstream hook applies wrap imperatively (it writes the
 * style on toggle), and code blocks inside non-active tabs mount hidden, so we
 * assert the wrapped state after mount and again whenever the block resizes
 * into view, until it has taken effect once.
 */
import { useThemeConfig } from '@docusaurus/theme-common';
import {
  CodeBlockContextProvider,
  createCodeBlockMetadata,
  useCodeWordWrap,
} from '@docusaurus/theme-common/internal';
import CodeBlockLayout from '@theme/CodeBlock/Layout';
import React, { useEffect, useRef } from 'react';

function useCodeBlockMetadata(props) {
  const { prism } = useThemeConfig();
  return createCodeBlockMetadata({
    code: props.children,
    className: props.className,
    metastring: props.metastring,
    magicComments: prism.magicComments,
    defaultLanguage: prism.defaultLanguage,
    language: props.language,
    title: props.title,
    showLineNumbers: props.showLineNumbers,
  });
}

function useDefaultWordWrap(wordWrap) {
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;

    const enable = () => {
      const codeElement = wordWrap.codeBlockRef.current?.querySelector('code');
      if (!codeElement) return;
      if (!wordWrap.isEnabled) wordWrap.toggle();
      applied.current = true;
    };

    enable();

    if (applied.current) return;

    const frame = requestAnimationFrame(enable);
    return () => cancelAnimationFrame(frame);
  });
}

export default function CodeBlockString(props) {
  const metadata = useCodeBlockMetadata(props);
  const wordWrap = useCodeWordWrap();
  useDefaultWordWrap(wordWrap);

  return (
    <CodeBlockContextProvider metadata={metadata} wordWrap={wordWrap}>
      <CodeBlockLayout />
    </CodeBlockContextProvider>
  );
}
