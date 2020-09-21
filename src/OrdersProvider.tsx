import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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
const websocketUri = `ws://${lanEnv}:3000/KITHCEN`;

interface Props {
  children: ReactNode;
}

const isWebsocket = (
  possibleWebsocket: any | undefined
): possibleWebsocket is WebSocket => {
  return typeof possibleWebsocket?.send === 'function';
};

interface Context {
  orders: Array<Order>;
  removeOrder: (id: string) => void;
  addOrder: (order: Order) => void;
}

const initContext: Context = {
  orders: [],
  removeOrder: shouldBeOverridden,
  addOrder: shouldBeOverridden
};

const OrdersContext = createContext(initContext);
const OrdersProvider = (props: Props) => {
  const { children } = props;
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  // let socket = new WebSocket(websocketUri);
  // console.log('new connection', socket.readyState);
  // console.log('hey');
  //
  useEffect(() => {
    // console.log('socket', socket);
    if (!isWebsocket(socket)) {
      console.log('setting websocket');
      setSocket(new WebSocket(websocketUri));
    } else {
      socket.onopen = (e) => {
        console.log('open');
      };

      socket.onclose = (e) => {
        console.log('closing', socket.readyState);
      };

      if (socket.readyState === 3) {
        socket.close();
        setSocket(new WebSocket(websocketUri));
      }

      console.log('useEffect reset');
      // socket.close();
      // setSocket(new WebSocket(websocketUri));

      return () => {
        socket.close()
      }
    }
  }, [socket]);

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
