<script lang="ts">
  import Icon from '@/components/Icon.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    onclick?: () => void;
    icon?: string;
    loading?: boolean;
    disabled?: boolean;
    type?: HTMLButtonAttributes['type'];
    id?: string;
    className?: string[];
    children?: Snippet;
    [key: string]: any;
  }

  let {
    variant = 'primary',
    size = 'medium',
    onclick,
    icon,
    loading,
    disabled,
    type,
    id,
    className,
    children,
    ...props
  }: Props = $props();
</script>

<button
  {id}
  class={[
    'btn',
    variant,
    size,
    disabled && 'disabled',
    loading && 'disabled',
    !children && icon && 'icon-only',
    ...(className ?? []),
  ]}
  {onclick}
  {type}
  {disabled}
  {...props}
>
  {#if loading}
    <!-- <Loader /> -->
  {/if}

  {#if children}
    <span class="btn-text">{@render children()}</span>
  {/if}

  {#if icon}
    <Icon name={icon} className="icon btn-icon" />
  {/if}
</button>

<style>
  .btn {
    min-width: 4ch;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-md);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
    text-decoration: none;
    user-select: none;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast),
      box-shadow var(--transition-fast),
      transform var(--transition-fast);

    &:active {
      transform: scale(0.98);
    }
  }

  .btn.small {
    padding: var(--space-2xs) var(--space-xs);
    font-size: var(--font-size-sm);
  }

  .btn.medium {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-md);
  }

  .btn.large {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-lg);
  }

  .btn.primary {
    background-color: var(--accent);
    color: var(--bg-surface);

    &:hover {
      background-color: var(--accent-hover);
      color: var(--bg-surface);
    }
  }

  .btn.secondary {
    background-color: var(--bg-subtle);
    color: var(--text-primary);
    border: var(--stroke-thin) solid var(--border-color);

    &:hover {
      background-color: var(--bg-hover);
    }
  }

  .btn.ghost {
    background-color: transparent;
    color: var(--text-secondary);

    &:hover {
      background-color: var(--bg-subtle);
      color: var(--text-primary);
    }
  }

  .btn-icon {
    color: currentColor;
    font-size: inherit;
  }
</style>
