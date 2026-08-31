<script lang="ts">
  import Button from '@/components/buttons/Button.svelte';
  import { onMount, setContext } from 'svelte';
  import Icon from '@/components/Icon.svelte';
  import {
    getCount,
    setCount,
    resetCount,
    onCountChange,
    onResetAll,
  } from '@/utils/athkarStorage';

  interface Props {
    count: number;
    counterId?: string;
    className?: string;
  }

  let { count = 1, counterId, className }: Props = $props();

  let currentCount = $state(0);

  function increment() {
    if (currentCount < count) {
      currentCount++;
      if (counterId) {
        setCount(counterId, currentCount);
      }
    }
  }

  function handleReset() {
    currentCount = 0;
    if (counterId) {
      resetCount(counterId);
    }
  }

  onMount(() => {
    if (counterId) {
      const stored = getCount(counterId);
      if (stored > 0) {
        currentCount = Math.min(stored, count);
      }
    }

    const unsubCount = onCountChange(({ id, count: newCount }) => {
      if (counterId && id === counterId) {
        currentCount = Math.min(newCount, count);
      }
    });

    const unsubReset = onResetAll(() => {
      currentCount = 0;
    });

    return () => {
      unsubCount();
      unsubReset();
    };
  });

  // Provide a reactive object or getters so consumers see state changes
  setContext('athkar-counter', {
    get id() {
      return counterId;
    },
    get count() {
      return currentCount;
    },
    increment,
    reset: handleReset,
  });
</script>

<div
  class={['athkar-counter flex justify-start items-center gap-md', className]}
  dir="rtl"
>
  <Button
    aria-label="Recite"
    className={[
      'counter-button aspect-square',
      currentCount === count ? 'completed' : '',
    ]}
    size={'large'}
    onclick={increment}
  >
    {currentCount}
  </Button>

  {#if currentCount > 0}
    <Button
      aria-label="Reset"
      variant={'ghost'}
      size={'small'}
      icon={'refresh'}
      onclick={handleReset}
    >
      تصفير
    </Button>
  {/if}

  <div
    class={[
      'counter-badge margin-start-auto',
      currentCount === count && 'completed',
    ]}
    lang="ar"
    dir="rtl"
  >
    {#if count === 1}
      <span>مرة واحدة</span>
    {:else if (count % 10 === 0 && count > 10) || count % 100 === 0 || count % 1000 === 0 || count >= 11}
      <span>{count} مرة</span>
    {:else}
      <span>{count} مرات</span>
    {/if}

    {#if currentCount === count}
      <Icon name="check_circle" className="success" />
    {/if}
  </div>
</div>

<style>
  :global(.btn.counter-button) {
    min-width: 6ch;
    aspect-ratio: 1/1;

    &.completed {
      background-color: var(--status-success) !important;
      border-color: var(--status-success);
      color: var(--bg-surface);
    }
  }

  .counter-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-2xs) var(--space-md);
    background-color: var(--accent-subtle);
    color: var(--accent-text);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    border-radius: var(--radius-full);
    white-space: nowrap;
    transition: var(--transition-fast);

    &.completed {
      padding: var(--space-2xs) var(--space-md) var(--space-2xs) var(--space-sm);
      color: var(--status-success);
    }
  }
</style>
