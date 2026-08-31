<script lang="ts">
  interface Props {
    name: string;
    className?: string;
    [key: string]: any;
  }

  let { name, className, ...props }: Props = $props();
</script>

<span class={['material-symbols-rounded', 'icon', className]} {...props}>
  {name}
</span>

<style>
  .icon {
    transition: all var(--transition-fast);

    &.success {
      color: var(--status-success);
    }

    &.warning {
      color: var(--status-warning);
    }

    &.error {
      color: var(--status-error);
    }
  }
</style>
