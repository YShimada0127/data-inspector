import { useDevToolsPluginClient, type EventSubscription } from 'expo/devtools';
import { useEffect, useReducer } from 'react';

export function useDataInspector(name: string, data: Record<string, any>) {
  const client = useDevToolsPluginClient('data-inspector');
  const [updateIndex, refresh] = useReducer((prev: number) => prev + 1, 0);

  useEffect(() => {
    const subscriptions: EventSubscription[] = [];

    subscriptions.push(
      client?.addMessageListener('refresh', () => {
        refresh();
      })
    );

    return () => {
      for (const subscription of subscriptions) {
        subscription?.remove();
      }
    };
  }, [client]);

  useEffect(() => {
    client?.sendMessage('updateData', { [name]: data });
  }, [data, updateIndex]);
}
