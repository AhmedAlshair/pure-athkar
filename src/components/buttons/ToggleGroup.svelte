<script lang="ts">
  import Icon from '@/components/Icon.svelte';
  import { untrack } from 'svelte';

  export interface ToggleOption {
    value: string;
    label: string;
    icon?: string;
    [key: string]: any;
  }

  interface Props {
    options: ToggleOption[];
    value?: string;
    defaultValue?: string;
    groupName?: string;
    dir?: 'ltr' | 'rtl' | 'auto';
    className?: string;
    onchange?: (value: string) => void;
  }

  let {
    options = [],
    value,
    defaultValue,
    groupName = 'athkar-group',
    dir = 'auto',
    className = '',
    onchange,
  }: Props = $props();

  let selected = $state(
    untrack(
      () =>
        value || defaultValue || (options.length > 0 ? options[0].value : ''),
    ),
  );

  let tabButtons: (HTMLButtonElement | null)[] = $state([]);

  function selectOption(val: string, updateHash = true) {
    selected = val;

    if (updateHash && typeof window !== 'undefined') {
      history.replaceState(null, '', `#${val}`);
    }

    onchange?.(val);
  }

  function handleKeyDown(event: KeyboardEvent, index: number) {
    const isRtl =
      document.dir === 'rtl' || document.documentElement.dir === 'rtl';
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    let nextIndex = index;

    if (event.key === nextKey) {
      event.preventDefault();
      nextIndex = (index + 1) % options.length;
    } else if (event.key === prevKey) {
      event.preventDefault();
      nextIndex = (index - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = options.length - 1;
    }

    if (nextIndex !== index) {
      const targetOption = options[nextIndex];
      selectOption(targetOption.value);
      tabButtons[nextIndex]?.focus();
    }
  }
</script>

<div
  class={['toggle-group', className]}
  role="tablist"
  aria-label="أنواع الأذكار"
  {dir}
>
  {#each options as option, i (option.value)}
    {@const isSelected = selected === option.value}
    <a
      href={`/pure-athkar/${option.value}/`}
      role="tab"
      id="tab-{option.value}"
      aria-selected={isSelected}
      class="toggle-button {isSelected ? 'active' : ''}"
    >
      {#if option.icon}
        <Icon name={option.icon} className="toggle-icon" />
      {/if}
      <span class="toggle-label">{option.label}</span>
    </a>
    <!-- <button
      type="button"
      role="tab"
      id={`tab-${option.value}`}
      aria-selected={isSelected}
      aria-controls={`panel-${option.value}`}
      tabindex={isSelected ? 0 : -1}
      class={['toggle-button', isSelected && 'active']}
      bind:this={tabButtons[i]}
      onclick={() => selectOption(option.value)}
      onkeydown={(e) => handleKeyDown(e, i)}
    >
      {#if option.icon}
        <Icon name={option.icon} className="toggle-icon" />
      {/if}
      <span class="toggle-label">{option.label}</span>
    </button> -->
  {/each}
</div>

<style>
  .toggle-group {
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: space-evenly;
    gap: var(--space-2xs);
    padding: var(--space-2xs);
    background-color: var(--bg-subtle);
    border: var(--stroke-thin) solid var(--border-color);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-subtle);
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .toggle-group::-webkit-scrollbar {
    display: none;
  }

  .toggle-button {
    flex: 1 0 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    text-decoration: none;
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-full);
    color: var(--text-secondary);
    background-color: transparent;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    outline: none;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      box-shadow var(--transition-fast),
      transform var(--transition-fast);

    @media screen and (max-width: 640px) {
      flex-shrink: 0;
      font-size: var(--font-size-sm);

      &:not(.active) .toggle-label {
        display: none;
      }
    }

    &:hover:not(.active) {
      color: var(--text-primary);
      background-color: var(--bg-hover);
    }

    &:active {
      transform: scale(0.97);
    }

    &:focus-visible {
      outline: var(--stroke-thick) solid var(--accent);
      outline-offset: 2px;
    }

    &.active {
      background-color: var(--accent);
      color: var(--bg-surface);
      font-weight: var(--font-weight-semibold);
      box-shadow: var(--shadow-subtle);

      &:hover {
        background-color: var(--accent-hover);
        color: var(--bg-surface);
      }
    }
  }

  .toggle-label {
    padding-inline-end: var(--space-xs);
    font-family: var(--font-arabic);
    line-height: var(--lh-tight);
  }

  :global(.toggle-icon) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    aspect-ratio: 1;
    font-size: 1.4rem;
    line-height: 1;
  }

  /* Global panel animation and visibility behavior */
  :global(.athkar-panel) {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    width: 100%;
  }

  :global(.athkar-panel[hidden]) {
    display: none !important;
  }

  :global(.athkar-panel.active) {
    display: flex !important;
    animation: athkarFadeIn var(--transition-default) ease-out forwards;
  }

  @keyframes athkarFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
