<script lang="ts">
  import Icon from '@/components/Icon.svelte';
  import type { Snippet } from 'svelte';
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from 'svelte/elements';

  type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
  type ButtonSize = 'small' | 'medium' | 'large';

  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: HTMLAnchorAttributes['href'];
    target?: HTMLAnchorAttributes['target'];
    rel?: HTMLAnchorAttributes['rel'];
    download?: HTMLAnchorAttributes['download'];
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
    href,
    target,
    rel,
    download,
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

  let isDisabled = $derived(Boolean(disabled || loading));
  let classes = $derived([
    'btn',
    variant,
    size,
    isDisabled && 'disabled',
    !children && icon && 'icon-only',
    ...(className ?? []),
  ]);
</script>

{#if href}
  <a
    {id}
    class={classes}
    href={isDisabled ? undefined : href}
    {target}
    {rel}
    {download}
    aria-disabled={isDisabled || undefined}
    tabindex={isDisabled ? -1 : props.tabindex}
    onclick={isDisabled ? (event) => event.preventDefault() : onclick}
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
  </a>
{:else}
  <button
    {id}
    class={classes}
    {onclick}
    type={type ?? 'button'}
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
{/if}

<style>
  .btn {
    min-width: 4ch;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
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

    &:active,
    &:focus-visible {
      transform: scale(0.95);
    }
  }

  .btn.small {
    padding: var(--space-2xs) var(--space-xs);
    font-size: var(--font-size-sm);
    gap: var(--space-2xs);
  }

  .btn.medium {
    padding: var(--space-xs) var(--space-md);
    font-size: var(--font-size-md);
  }

  .btn.large {
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--font-size-xl);
  }

  .btn.primary {
    background-color: var(--accent);
    color: var(--bg-surface);

    &:hover:not(:disabled) {
      background-color: var(--accent-hover);
      color: var(--bg-surface);
    }
  }

  .btn.secondary {
    background-color: var(--bg-subtle);
    color: var(--text-primary);
    border: var(--stroke-thin) solid var(--border-color);

    &:hover:not(:disabled) {
      background-color: var(--bg-hover);
    }
  }

  .btn.ghost {
    background-color: transparent;
    color: var(--text-secondary);

    &:hover:not(:disabled) {
      background-color: var(--bg-subtle);
      color: var(--text-primary);
    }
  }

  .btn.success {
    background-color: var(--success);
    color: var(--bg-surface);

    &:hover:not(:disabled) {
      background-color: var(--success-hover);
      color: var(--bg-surface);
    }
  }

  .btn.danger {
    background-color: var(--danger);
    color: var(--bg-surface);

    &:hover:not(:disabled) {
      background-color: var(--danger-hover);
      color: var(--bg-surface);
    }
  }

  .btn-icon {
    color: currentColor;
    font-size: inherit;
  }
</style>
