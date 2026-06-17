import type { Agent } from '@site/src/data/home';
import { LuCircle, LuCircleCheckBig } from 'react-icons/lu';

export const AgentButton = ({
  agent,
  on,
  onClick,
}: {
  agent: Agent;
  on: boolean;
  onClick: () => void;
}) => (
  <button
    type='button'
    role='radio'
    aria-checked={on}
    onClick={onClick}
    className={`flex items-center gap-3 p-[13px_14px] rounded-[14px] border text-left cursor-pointer transition-[background,border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
      on
        ? 'text-ink border-accent/50 bg-accent/10'
        : 'text-muted border-line bg-card hover:bg-card-hover hover:border-white/[0.16]'
    }`}
  >
    <span
      className='shrink-0 size-5 bg-current [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]'
      style={{
        maskImage: `url(${agent.icon})`,
        WebkitMaskImage: `url(${agent.icon})`,
      }}
    />
    <span className='flex-1 min-w-0 text-[14px] font-medium tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap'>
      {agent.name}
    </span>
    <span
      className={`shrink-0 size-[18px] [&>svg]:size-[18px] ${on ? 'text-accent' : 'text-faint'}`}
      aria-hidden
    >
      {on ? <LuCircleCheckBig /> : <LuCircle />}
    </span>
  </button>
);
