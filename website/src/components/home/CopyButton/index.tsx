import { useState } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';

export const CopyButton = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type='button'
      aria-label={copied ? 'Copied' : label}
      onClick={onCopy}
      className='inline-flex items-center justify-center shrink-0 size-[26px] text-accent cursor-pointer transition-opacity duration-200 hover:opacity-80 [&>svg]:size-4'
    >
      {copied ? <LuCheck /> : <LuCopy />}
    </button>
  );
};
