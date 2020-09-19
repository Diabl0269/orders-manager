import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  View
} from 'react-native';

const mockOrder: Order = {
  name: 'Dish',
  table: '100',
  orderTime: new Date()
};

const createArrayOfLengthWithNumbers = (length: number) =>
  Array.from({ length }, (_, i) => i + 1);

const outArray = createArrayOfLengthWithNumbers(6);

const formatDate = (date: Date) => {
  return ` ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
};

const formatTime = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

// TODO change to real IP
const lanEnv = '192.168.1.21';

interface Order {
  name: string;
  table: string;
  orderTime: Date;
  id: string;
}

const isOrder = (obj: Order) => {
  return obj.name && obj.table && obj.orderTime && obj.id;
};

interface OrderProps {
  order: Order;
}

const OrderItem = (props: OrderProps) => {
  const { order } = props;
  const { name, table, orderTime } = order;

  const formattedTime = useMemo(() => {
    return formatTime(orderTime);
  }, [orderTime]);

  return (
    <View style={styles.orderContainer}>
      <Text>Dish name: {name}</Text>
      <Text>Table number: {table}</Text>
      <Text>Order time: {formattedTime}</Text>
    </View>
  );
};

const App = () => {
  const socket = new WebSocket(`ws://${lanEnv}:3000`);

  // For debugging weboscokets
  const [serverMessage, setServerMessage] = useState('No message');

  const debugWebsocket = () => {
    socket.send('debugging');
  };

  // useEffect(() => {
  //   socket.onopen = (e) => {
  //     console.log('onopen', e);

  //  Receive new orders
  //     socket.onmessage = (e) => {
  //       const parsedData = JSON.parse(e.data);
  //       if (isOrder(parsedData)) setOrders(orders.concat(parsedData));
  //     };

  //   };
  // }, []);

  const [orders, setOrders] = useState([
    mockOrder,
    mockOrder,
    mockOrder,
    mockOrder,
    mockOrder
  ]);

  const removeOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const addOrder = (order: Order) => {
    if(isOrder(order)) setOrders(orders.concat(order))
  }

  const ordersContainer = useMemo(() => {
    console.log('oreders', orders);
    //
    return orders.map((order: Order, i: number) => {
      const { table, orderTime, name } = order;
      return <OrderItem order={order} key={`${name}_${table}_${i}`} />;
    });
  }, [orders]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerWithTitle}>
        <Text>Orders Panel</Text>
        <View style={styles.ordersPanel}>{ordersContainer}</View>
      </View>

      {/* Debuggins button */}
      <Button title="Test websocket" onPress={debugWebsocket} />

      <View style={styles.containerWithTitle}>
        <Text>Out Panel</Text>
        <View style={styles.outContainer}>
          {outArray.map((panel) => {
            return (
              <View style={styles.outPanel} key={panel}>
                <Text>{panel}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <StatusBar hidden={true} />
    </SafeAreaView>
  );
};

const border: StyleProp<object> = {
  borderStyle: 'solid',
  borderColor: '#333',
  borderWidth: 1,
  borderRadius: 5
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    flexGrow: 1
  },
  containerWithTitle: {
    ...border,
    alignItems: 'center',
    flexDirection: 'column'
  },
  ordersPanel: {
    width: '95%',
    height: 150,
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 5
  },
  orderContainer: {
    ...border,
    height: '95%',
    padding: 5,
    justifyContent: 'space-around'
  },
  outContainer: {
    width: '95%',
    height: 100,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  outPanel: {
    ...border,
    height: '95%',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;
