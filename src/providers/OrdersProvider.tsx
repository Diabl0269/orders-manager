import React, {
  createContext, Dispatch,
  ReactNode, SetStateAction, useCallback,
  useContext,
  useEffect, useMemo,
  useState
} from "react";
import { createArrayOfLengthWithNumbers, shouldBeOverridden } from "../utils";
import { Roles, Order } from "../types";

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

const mockOrdersArray: Array<Order> = createArrayOfLengthWithNumbers(
  5
).map((number) => createMockOrder(number.toString()));

// TODO change to real static IP
const lanEnv = "192.168.1.21";

interface Props {
  children: ReactNode;
}

interface Context {
  orders: Array<Order>;
  removeOrder: (id: string) => void;
  addOrder: (order: Order) => void;
  connect: Function,
  setRole: Dispatch<SetStateAction<Roles | undefined>>,
  role: Roles | undefined,
  socket: WebSocket | undefined
}

const initContext: Context = {
  orders: [],
  removeOrder: shouldBeOverridden,
  addOrder: shouldBeOverridden,
  connect: shouldBeOverridden,
  setRole: shouldBeOverridden,
  role: undefined,
  socket: undefined
};

const OrdersContext = createContext(initContext);
const OrdersProvider = (props: Props) => {
  const { children } = props;
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [role, setRole] = useState<undefined | Roles>(undefined);


// TODO fix current role
  const websocketUri = useMemo(() => {
    return `ws://${lanEnv}:3000/${role}`;
  }, [role]);

  let timeout = 250;

  // useEffect(() => {
  //   connect()
  // }, []);

  const connect = () => {
    const ws = new WebSocket(websocketUri);
    let connectionInterval: number;

    ws.onopen = (e) => {
      console.log("open");
      setSocket(ws);

      timeout = 250;
      clearTimeout(connectionInterval);
    };

    ws.onclose = () => {
      console.log("ws", ws.readyState);

      timeout *= 2;
      connectionInterval = setTimeout(check, Math.min(10000, timeout));
    };

    ws.onerror = (e) => {
      console.log("error", e);
      ws.close();
    };

  };


  const check = () => {
    console.log("check", socket);

    if (!socket || socket.readyState === socket.CLOSED) connect();
  };

  // For debugging weboscokets
  // const [serverMessage, setServerMessage] = useState('No message');

  const [orders, setOrders] = useState<Array<Order>>(mockOrdersArray);

  const removeOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const addOrder = (order: Order) => {
    if (isOrder(order)) setOrders(orders.concat(order));
  };
  return (
    <OrdersContext.Provider value={{ orders, addOrder, removeOrder, connect, setRole, socket, role }}>
      {children}
    </OrdersContext.Provider>
  );
};

const useOrders = () => useContext(OrdersContext);

export { OrdersProvider, useOrders, Order, Roles };
