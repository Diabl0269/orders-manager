import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react';
import { createArrayOfLengthWithNumbers, shouldBeOverridden } from './utils';

interface Order {
  name: string;
  table: string;
  orderTime: Date;
  id: string;
}

const isOrder = (obj: Order) => {
  return obj.name && obj.table && obj.orderTime && obj.id;
};

const formatTime = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

const createMockOrder = (id: string) => ({
  name: Math.random().toString().slice(0, 3),
  table: Math.random().toString().slice(0, 3),
  orderTime: new Date(),
  id
});

const mockOredersArray: Array<Order> = createArrayOfLengthWithNumbers(
  5
).map((number) => createMockOrder(number.toString()));

// TODO change to real IP
const lanEnv = '192.168.1.21';

interface Props {
  children: ReactNode;
}

interface Context {
  orders: Array<Order>;
  removeOrder: (id: string) => void;
  addOrder: (order: Order) => void
}

const initContext: Context = {
  orders: [],
  removeOrder: shouldBeOverridden,
  addOrder: shouldBeOverridden
};

const OrdersContext = createContext(initContext);
const OrdersProvider = (props: Props) => {
  const { children } = props;
  const socket = new WebSocket(`ws://${lanEnv}:3000`);

  // For debugging weboscokets
  // const [serverMessage, setServerMessage] = useState('No message');

  const [orders, setOrders] = useState<Array<Order>>(mockOredersArray);

  const removeOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const addOrder = (order: Order) => {
    if (isOrder(order)) setOrders(orders.concat(order));
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

  return (
    <OrdersContext.Provider value={{ orders, addOrder, removeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

const useOrders = () => useContext(OrdersContext);

export { OrdersProvider, useOrders, Order };
