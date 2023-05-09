import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Button,
  FlatList,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';

const generateColor = () => `#${Math.random().toString(16).substring(2, 8)}`;

interface Item {
  color: string;
  index: number;
}

const PAGE_SIZE = 10;

const genPage = (startIndex: number) =>
  Array(PAGE_SIZE)
    .fill(0)
    .map((_, i) => ({index: i + startIndex, color: generateColor()}));

const initialData = genPage(0);

const App = () => {
  const [data, setData] = useState(initialData);
  const [isRtl, setRtl] = useState(I18nManager.isRTL);
  const initialRtlState = useRef(I18nManager.isRTL);
  const listRef = useRef<FlatList>(null);

  const renderItem = useCallback(
    ({item}: {item: Item}) => (
      <View style={[styles.item, {backgroundColor: item.color}]}>
        <Text style={styles.text}>{item.index}</Text>
      </View>
    ),
    [],
  );

  const loadMore = useCallback(() => {
    // setData(prevData => {
    //   const newData = [...prevData];
    //   for (let i = 0; i < PAGE_SIZE; i++) {
    //     newData.push({index: prevData.length + i, color: generateColor()});
    //   }
    //   return newData;
    // });

    const newData = [...data, ...genPage(data.length)];
    setData(newData);
  }, [data]);

  const toggleRtl = useCallback(() => {
    setRtl(wasRtl => {
      I18nManager.forceRTL(!wasRtl);
      return !wasRtl;
    });
  }, []);

  const [hasReachedEnd, setReachedEnd] = useState(false);
  const hasReachedEndRef = useRef(hasReachedEnd);
  const numItemsRef = useRef(data.length);

  useEffect(() => {
    numItemsRef.current = data.length;

    console.log({
      maxIndex: Math.max(...data.map(i => i.index)),
      numItems: data.length - 1,
    });
  }, [data]);
  useEffect(() => {
    hasReachedEndRef.current = hasReachedEnd;
  }, [hasReachedEnd]);

  const handleViewableItemsChanged = useRef(
    ({
      viewableItems,
      changed,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      // if (hasReachedEndRef.current) {
      //   return;
      // }

      const threshold = 3;

      //console.log(JSON.stringify(viewableItems.map(i => i.index)));
      const furthestItemIdx = Math.max(
        ...viewableItems.map(i => i.index ?? -1),
      );
      const shouldUserFurthestItem =
        isFinite(furthestItemIdx) && furthestItemIdx !== -1;

      // console.log({
      //   furthestItemIdx,
      //   shouldUserFurthestItem,
      //   numItems: numItemsRef.current,
      //   threshold: numItemsRef.current - furthestItemIdx,
      // });
      // if (numItemsRef.current >= 40) {
      //   numItemsRef.current -= PAGE_SIZE;
      // }
      if (
        shouldUserFurthestItem &&
        numItemsRef.current - furthestItemIdx < threshold
      ) {
        console.log('[reached end]');
        //hasReachedEndRef.current = true;
        //setReachedEnd(true);
        loadMore();
      }
    },
  );

  useEffect(() => {
    if (hasReachedEnd) {
      console.log('[loading more]');
      loadMore();
      setReachedEnd(false);
      hasReachedEndRef.current = false;
    }
  }, [hasReachedEnd, loadMore]);

  const keyExtractor = useCallback((item: Item, index: number) => {
    return `item-${index}-${item.index}`;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ref={listRef}
        horizontal
        keyExtractor={keyExtractor}
        //key={`flatlist-n-${data.length}`}
        style={[
          styles.flatlist,
          {
            //flexDirection: 'row-reverse',
          },
        ]}
        data={data}
        renderItem={renderItem}
        snapToEnd
        disableVirtualization
        onViewableItemsChanged={handleViewableItemsChanged.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 20,
        }}
        // onEndReachedThreshold={0.3}
        // onEndReached={loadMore}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={loadMore}
        //     tintColor={'red'}
        //   />
        // }
      />
      <View style={[styles.rtlBox]}>
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
  flatlist: {
    flexGrow: 0,
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
  },
  status: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  reload: {
    marginTop: 20,
  },
});

export default App;
