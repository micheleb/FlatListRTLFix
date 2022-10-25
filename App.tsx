import React, {useCallback, useRef, useState} from 'react';
import {
  Button,
  FlatList,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const generateColor = () => `#${Math.random().toString(16).substring(2, 8)}`;

interface Item {
  color: string;
  index: number;
}

const initialData = Array(10)
  .fill(0)
  .map((_, i) => ({index: i, color: generateColor()}));

const App = () => {
  const [data, setData] = useState(initialData);
  const [isRtl, setRtl] = useState(I18nManager.isRTL);
  const initialRtlState = useRef(I18nManager.isRTL);

  const renderItem = useCallback(
    ({item}: {item: Item}) => (
      <View style={[styles.item, {backgroundColor: item.color}]}>
        <Text style={styles.text}>{item.index}</Text>
      </View>
    ),
    [],
  );

  const loadMore = useCallback(() => {
    setData(prevData => {
      const newData = [...prevData];
      for (let i = 0; i < 10; i++) {
        newData.push({index: prevData.length + i, color: generateColor()});
      }
      return newData;
    });
  }, []);

  const toggleRtl = useCallback(() => {
    setRtl(wasRtl => {
      I18nManager.forceRTL(!wasRtl);
      return !wasRtl;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        onEndReachedThreshold={0.3}
        onEndReached={loadMore}
      />
      <View style={styles.rtlBox}>
        <View style={styles.status}>
          <Text style={styles.text}>RTL enabled: {JSON.stringify(isRtl)}</Text>
        </View>
        <Button onPress={toggleRtl} title="Toggle RTL" />
        {isRtl !== initialRtlState.current ? (
          <Text style={styles.reload}>
            Reload the app to see it with RTL mode{' '}
            {isRtl ? 'enabled' : 'disabled'}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  item: {
    width: 70,
    height: 70,
    marginEnd: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  text: {
    fontSize: 14,
  },
  rtlBox: {
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
  },
  status: {
    flexDirection: 'row',
  },
  reload: {
    marginTop: 20,
  },
});

export default App;
