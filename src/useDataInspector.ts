import { useDevToolsPluginClient, type EventSubscription } from 'expo/devtools';
import { useEffect, useReducer } from 'react';

export function useDataInspector(name: string, data: Record<string, any>) {
  const client = useDevToolsPluginClient('data-inspector');
  const [, refresh] = useReducer((prev) => prev + 1, 0);

  useEffect(() => {
    if (!client) return;

    const subscription = client.addMessageListener('refresh', refresh);

    return () => subscription?.remove();
  }, [client]);

  useEffect(() => {
    client?.sendMessage('updateData', { [name]: data });
  }, [client, name, data]);
}
