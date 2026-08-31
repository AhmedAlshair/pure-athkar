<script lang="ts">
  import Icon from '@/components/Icon.svelte';
  import { onMount } from 'svelte';
  import {
    getStoredTheme,
    setTheme,
    onThemeChange,
    getStoredFontSize,
    setFontSize,
    onFontSizeChange,
    resetAllCounts,
    type ThemeMode,
    type FontSizeLevel,
  } from '@/utils/athkarStorage';
  import Button from './buttons/Button.svelte';

  interface Props {
    className?: string;
  }

  let { className = '' }: Props = $props();

  let isOpen = $state(false);
  let currentTheme = $state<ThemeMode>('light');
  let currentFontSize = $state<FontSizeLevel>(0);
  let isResetConfirmed = $state(false);
  let resetTimer: ReturnType<typeof setTimeout> | null = null;
  let dropdownRef: HTMLDivElement | null = $state(null);
  let triggerRef: HTMLButtonElement | null = $state(null);

  const fontSizeLabels: Record<FontSizeLevel, string> = {
    [-2]: 'أصغر (-2)',
    [-1]: 'صغير (-1)',
    [0]: 'افتراضي',
    [1]: 'كبير (+1)',
    [2]: 'أكبر (+2)',
  };

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function closeDropdown() {
    isOpen = false;
  }

  function handleThemeChange(theme: ThemeMode) {
    currentTheme = theme;
    setTheme(theme);
  }

  function decreaseFontSize() {
    if (currentFontSize > -2) {
      const nextLevel = (currentFontSize - 1) as FontSizeLevel;
      currentFontSize = nextLevel;
      setFontSize(nextLevel);
    }
  }

  function increaseFontSize() {
    if (currentFontSize < 2) {
      const nextLevel = (currentFontSize + 1) as FontSizeLevel;
      currentFontSize = nextLevel;
      setFontSize(nextLevel);
    }
  }

  function handleResetAll() {
    resetAllCounts();
    isResetConfirmed = true;

    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      isResetConfirmed = false;
    }, 2000);
  }

  function handleClickOutside(event: MouseEvent) {
    if (!isOpen) return;
    const target = event.target as Node;
    if (
      dropdownRef &&
      !dropdownRef.contains(target) &&
      triggerRef &&
      !triggerRef.contains(target)
    ) {
      closeDropdown();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      closeDropdown();
      triggerRef?.focus();
    }
  }

  onMount(() => {
    currentTheme = getStoredTheme();
    currentFontSize = getStoredFontSize();

    // Ensure DOM is synced with stored settings
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute(
      'data-font-size',
      String(currentFontSize),
    );

    const unsubTheme = onThemeChange((theme) => {
      currentTheme = theme;
    });

    const unsubFontSize = onFontSizeChange((level) => {
      currentFontSize = level;
    });

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubTheme();
      unsubFontSize();
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      if (resetTimer) clearTimeout(resetTimer);
    };
  });
</script>

<div class={['settings-dropdown-wrapper', className]} dir="rtl">
  <button
    type="button"
    bind:this={triggerRef}
    class={['settings-trigger-btn', isOpen && 'active']}
    aria-label="إعدادات القراءة والعدادات"
    aria-expanded={isOpen}
    aria-haspopup="true"
    onclick={toggleDropdown}
    title="خيارات العرض والعدادات"
  >
    <Icon name="tune" className="settings-icon" />
  </button>

  {#if isOpen}
    <div
      bind:this={dropdownRef}
      class="settings-menu-panel stack-sm"
      role="region"
      aria-label="لوحة الإعدادات"
    >
      <!-- Header -->
      <div class="menu-header flex items-center justify-between">
        <span class="menu-title">خيارات العرض</span>
        <Button
          variant={'ghost'}
          size={'small'}
          icon={'keyboard_arrow_up'}
          onclick={closeDropdown}
          aria-label="إغلاق الإعدادات"
        />
      </div>

      <!-- Theme Switcher -->
      <div class="setting-item stack-2xs">
        <div class="setting-label flex items-center gap-xs">
          <Icon name="palette" className="label-icon" />
          <span>المظهر</span>
        </div>
        <div
          class="theme-segmented-group"
          role="radiogroup"
          aria-label="اختيار المظهر"
        >
          <button
            type="button"
            role="radio"
            aria-checked={currentTheme === 'light'}
            class={['theme-opt-btn', currentTheme === 'light' && 'active']}
            onclick={() => handleThemeChange('light')}
          >
            <Icon name="light_mode" className="opt-icon" />
            <span>فاتح</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={currentTheme === 'dark'}
            class={['theme-opt-btn', currentTheme === 'dark' && 'active']}
            onclick={() => handleThemeChange('dark')}
          >
            <Icon name="dark_mode" className="opt-icon" />
            <span>داكن</span>
          </button>
        </div>
      </div>

      <!-- Font Size Controller -->
      <div class="setting-item stack-2xs">
        <div class="setting-label flex items-center justify-between">
          <div class="flex items-center gap-xs">
            <Icon name="format_size" className="label-icon" />
            <span>حجم الخط</span>
          </div>
          <span class="font-level-text">{fontSizeLabels[currentFontSize]}</span>
        </div>

        <div class="font-size-stepper flex items-center justify-between">
          <Button
            variant={'ghost'}
            size={'small'}
            icon="remove"
            onclick={decreaseFontSize}
            aria-label="تصغير الخط"
            disabled={currentFontSize <= -2}
          />

          <div
            class="font-level-dots flex items-center gap-xs"
            aria-hidden="true"
          >
            {#each [-2, -1, 0, 1, 2] as lvl}
              <span
                class={[
                  'level-dot',
                  currentFontSize === lvl && 'active-dot',
                  currentFontSize > lvl && 'passed-dot',
                ]}
              ></span>
            {/each}
          </div>

          <Button
            variant={'ghost'}
            size={'small'}
            icon="add"
            onclick={increaseFontSize}
            aria-label="تكبير الخط"
            disabled={currentFontSize >= 2}
          />
        </div>
      </div>

      <div class="divider menu-divider" role="separator"></div>

      <!-- Reset All Counters Button -->
      <div class="setting-item">
        <Button
          variant={isResetConfirmed ? 'secondary' : 'primary'}
          size={'medium'}
          onclick={handleResetAll}
          icon={isResetConfirmed ? 'check' : 'restart_alt'}
        >
          {#if isResetConfirmed}
            <span>تم تصفير جميع العدادات</span>
          {:else}
            <span>تصفير جميع العدادات</span>
          {/if}
        </Button>
      </div>
    </div>
  {/if}
</div>

<style>
  .settings-dropdown-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    user-select: none;
  }

  .settings-trigger-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 48px;
    aspect-ratio: 1/1;
    border-radius: var(--radius-full);
    background-color: var(--bg-subtle);
    border: var(--stroke-thin) solid var(--border-color);
    color: var(--text-secondary);
    box-shadow: var(--shadow-subtle);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast),
      transform var(--transition-fast),
      box-shadow var(--transition-fast);

    &:hover {
      background-color: var(--bg-hover);
      color: var(--text-primary);
      border-color: var(--border-strong);
    }

    &:active {
      transform: scale(0.95);
    }

    &.active {
      background-color: var(--accent-subtle);
      color: var(--accent-text);
      border-color: var(--accent);
    }

    &:focus-visible {
      outline: var(--stroke-thick) solid var(--accent);
      outline-offset: 2px;
    }
  }

  :global(.settings-icon) {
    font-size: 1.4rem;
    line-height: 1;
  }

  /* Dropdown Panel */
  .settings-menu-panel {
    position: absolute;
    top: calc(100% + var(--space-xs));
    inset-inline-start: auto;
    inset-inline-end: 0;
    padding: var(--space-md);
    width: clamp(240px, 90vw, 400px);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    background-color: var(--bg-surface);
    border: var(--stroke-thin) solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-floating);
    animation: menuSlideDown var(--transition-fast) forwards;
    z-index: 100;

    @media screen and (max-width: 600px) {
      position: absolute;
      top: calc(100% + var(--space-xs));
      width: min(24rem, calc(100vw - 2 * var(--space-sm)));
      max-height: calc(100dvh - 2 * var(--space-3xl));
      overflow-y: auto;
    }
  }

  @keyframes menuSlideDown {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .menu-header {
    padding-block-end: var(--space-2xs);
    border-block-end: var(--stroke-thin) solid var(--border-color);
  }

  .menu-title {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    font-family: var(--font-arabic);
  }

  .setting-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .setting-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    font-family: var(--font-arabic);
  }

  :global(.label-icon) {
    font-size: 1.2rem;
    color: var(--text-muted);
  }

  .font-level-text {
    font-size: var(--font-size-sm);
    color: var(--accent-text);
    font-weight: var(--font-weight-semibold);
  }

  /* Theme Segmented Control */
  .theme-segmented-group {
    display: flex;
    align-items: center;
    background-color: var(--bg-subtle);
    border-radius: var(--radius-md);
    padding: var(--space-3xs);
    gap: var(--space-3xs);
    border: var(--stroke-thin) solid var(--border-color);
  }

  .theme-opt-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
    background-color: transparent;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      box-shadow var(--transition-fast);

    &:hover:not(.active) {
      color: var(--text-primary);
      background-color: var(--bg-hover);
    }

    &.active {
      background-color: var(--bg-surface);
      color: var(--accent-text);
      font-weight: var(--font-weight-semibold);
      box-shadow: var(--shadow-subtle);
    }
  }

  :global(.opt-icon) {
    font-size: 1.2rem;
  }

  /* Font Size Stepper */
  .font-size-stepper {
    background-color: var(--bg-subtle);
    border: var(--stroke-thin) solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-2xs) var(--space-xs);
  }

  .font-level-dots {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
  }

  .level-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background-color: var(--border-strong);
    transition: all var(--transition-fast);

    &.active-dot {
      width: 16px;
      background-color: var(--accent);
    }

    &.passed-dot {
      background-color: var(--accent-text);
      opacity: 0.6;
    }
  }
</style>
