/** Composable for real-time notification count via SSE */
export function useNotifications() {
  const count = useState<number>('notification-count', () => 0);
  const connected = useState<boolean>('notification-connected', () => false);

  let eventSource: EventSource | null = null;

  function connect(): void {
    if (import.meta.server || eventSource) return;

    eventSource = new EventSource('/api/notifications/stream');
    connected.value = true;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { type: string; count?: number };
        if (data.type === 'count' && typeof data.count === 'number') {
          count.value = data.count;
        }
      } catch {
        // Ignore malformed messages
      }
    };

    eventSource.onerror = () => {
      connected.value = false;
      eventSource?.close();
      eventSource = null;
      // Reconnect after 5 seconds
      setTimeout(connect, 5000);
    };
  }

  function disconnect(): void {
    eventSource?.close();
    eventSource = null;
    connected.value = false;
  }

  function decrement(): void {
    if (count.value > 0) count.value--;
  }

  function reset(): void {
    count.value = 0;
  }

  return {
    count: readonly(count),
    connected: readonly(connected),
    connect,
    disconnect,
    decrement,
    reset,
  };
}
