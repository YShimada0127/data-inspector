import { useDevToolsPluginClient, type EventSubscription } from 'expo/devtools';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type DataType = Record<string, any>;

export default function App() {
  const client = useDevToolsPluginClient('data-inspector');
  const [remoteData, setRemoteData] = useState<DataType>({});
  const [history, setHistory] = useState<[Date, DataType][]>([]);

  useEffect(() => {
    const subscriptions: EventSubscription[] = [];

    subscriptions.push(
      client?.addMessageListener('updateData', (data: DataType) => {
        setHistory((history) => {
          return [...history, [new Date(), data]];
        });
        setRemoteData((prev) => {
          return {
            ...prev,
            ...data,
          };
        });
      })
    );

    return () => {
      for (const subscription of subscriptions) {
        subscription?.remove();
      }
    };
  }, [client]);

  const handleRefresh = () => {
    client?.sendMessage('refresh', {});
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>
        That's the Web UI of the DevTools plugin. You can now edit the UI in the
        App.tsx.
      </Text>
      <Text style={[styles.text, styles.devHint]}>
        For development, you can also add `devServer` query string to specify
        the WebSocket target to the app's dev server.
      </Text>
      <Text style={[styles.text, styles.devHint]}>For example:</Text>
      <Pressable
        onPress={() => {
          window.location.href =
            window.location.href + '?devServer=localhost:8080';
        }}
      >
        <Text style={[styles.text, styles.textLink]}>
          {`${window.location.href}?devServer=localhost:8080`}
        </Text>
      </Pressable> */}

      <Pressable onPress={handleRefresh}>
        <Text style={styles.button}>Manual Refresh</Text>
      </Pressable>

      <Text>Remote Data:</Text>
      <Text>{JSON.stringify(remoteData, null, 2)}</Text>

      <Text>--------------------------</Text>

      <Text>History</Text>
      {history.map((item) => (
        <View style={styles.historyItem}>
          <Text style={{ color: '#666' }}>{item[0].toLocaleString()}</Text>
          <Text>{JSON.stringify(item[1])}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  devHint: {
    color: '#666',
  },
  textLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  button: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  historyItem: {
    flexDirection: 'row',
    gap: 10,
  },
});
