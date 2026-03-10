<script lang="ts">
  let {
    value = 0,
    label = 'Progress',
  }: {
    value?: number;
    label?: string;
  } = $props();

  const clampedValue = Math.min(100, Math.max(0, value));
</script>

<div
  class="progress-bar"
  role="progressbar"
  aria-valuenow={clampedValue}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={label}
>
  <div class="progress-fill" style="width: {clampedValue}%"></div>
  <span class="progress-text">{Math.round(clampedValue)}%</span>
</div>

<style>
  .progress-bar {
    position: relative;
    height: 24px;
    background: var(--color-surface-secondary, #f5f5f5);
    border-radius: var(--radius-sm, 4px);
    overflow: hidden;
    margin: var(--space-sm, 0.5rem) 0;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-primary, #2563eb);
    border-radius: var(--radius-sm, 4px);
    transition: width 0.3s ease;
  }

  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #1a1a1a);
  }
</style>
