import React, { useCallback, useMemo, useState } from "react";
import {
  Animated,
  Button,
  PanResponder,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from 'expo-status-bar';

import { useOrders, Order } from "../providers/OrdersProvider";
import { useScreen } from "../providers/ScreenProvider";
import { createArrayOfLengthWithNumbers } from "../utils";

const formatTime = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

const returnTrue = () => true;

const isHovering = ({
  moveX,
  moveY,
  x,
  y,
}: {
  moveX: number;
  moveY: number;
  x: Array<number>;
  y: Array<number>;
}) => moveX > x[0] && moveX < x[1] && moveY > y[0] && moveY < y[1];

// const formatDate = (date: Date) => {
//   return ` ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
// };

interface OrderProps {
  order: Order;
}

const OrderItem = (props: OrderProps) => {
  const { dropZoneValues } = useScreen();
  const { removeOrder } = useOrders();

  const { order } = props;
  const { name, table, orderTime, id } = order;

  const pan = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: returnTrue,
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: pan.x,
          dy: pan.y,
        },
      ],
      {
        useNativeDriver: false,
      }
    ),
    onPanResponderRelease: (e, gesture) => {
      const { moveX, moveY } = gesture;
      let key: number = 0;
      dropZoneValues.some(({ x, y }, index) => {
        console.log("isHovering");
        if (isHovering({ moveY, moveX, x, y })) {
          key = index;
          return true;
        }
      });

      if (key) {
        return removeOrder(id);
      }
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  const formattedTime = useMemo(() => {
    return formatTime(orderTime);
  }, [orderTime]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout(), styles.orderContainer]}
    >
      <Text>Dish name: {name}</Text>
      <Text>Table number: {table}</Text>
      <Text>Order time: {formattedTime}</Text>
    </Animated.View>
  );
};

interface PanelProps {
  panelNum: number;
}

interface OutPanelValue {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}
type OutPanelCallback = (id: number, dropZoneValue: OutPanelValue) => void;

const OutPanel = (props: PanelProps) => {
  const { panelNum } = props;
  const { dropZoneValues, setDropZoneValues, setViewValues } = useScreen();
  const [view, setView] = useState<View | null>();

  const callback: OutPanelCallback = (id, dropZoneValue) => {
    const { pageX, pageY, width, height } = dropZoneValue;
    setDropZoneValues(() => {
      dropZoneValues[id] = {
        x: [pageX, pageX + width],
        y: [pageY, pageY + height],
        hovered: false,
      };
      return dropZoneValues;
    });
  };

  // useEffect(() => {
  // }, [view, setViewValues, callback]);

  const onLayout = () => {
    setViewValues(view, callback, panelNum);
  };

  return (
    <View
      style={styles.outPanel}
      key={panelNum}
      ref={(ref) => setView(ref)}
      onLayout={onLayout}
    >
      <Text>{panelNum}</Text>
    </View>
  );
};

const outArray = createArrayOfLengthWithNumbers(6);

const OrdersManager = () => {
  const { orders } = useOrders();
  const { dropZoneValues } = useScreen();

  const ordersContainer = useMemo(() => {
    return orders.map((order, i) => {
      const { table, name } = order;
      return <OrderItem order={order} key={`${name}_${table}_${i}`} />;
    });
  }, [orders]);

  const outPanels = useMemo(() => {
    return outArray.map((panelNum) => {
      return <OutPanel panelNum={panelNum} key={panelNum} />;
    });
  }, [outArray]);

  const handleDebug = useCallback(() => {
    console.log("dropZoneValues", dropZoneValues);

    // socket.send('debugging');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerWithTitle}>
        <Text>Orders Panel</Text>
        <View style={styles.ordersPanel}>{ordersContainer}</View>
      </View>

      {/* Debuggins button */}
      <Button title="Debug button" onPress={handleDebug} />

      <View style={styles.containerWithTitle}>
        <Text>Out Panel</Text>
        <View style={styles.outContainer}>{outPanels}</View>
      </View>
      <StatusBar hidden={true} />
    </SafeAreaView>
  );
};

const border: StyleProp<object> = {
  borderStyle: "solid",
  borderColor: "#333",
  borderWidth: 1,
  borderRadius: 5,
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
    flexGrow: 1,
  },
  containerWithTitle: {
    ...border,
    alignItems: "center",
    flexDirection: "column",
  },
  ordersPanel: {
    width: "95%",
    height: 150,
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 5,
  },
  orderContainer: {
    ...border,
    height: "95%",
    padding: 5,
    justifyContent: "space-around",
  },
  outContainer: {
    width: "95%",
    height: 100,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  outPanel: {
    ...border,
    height: "95%",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersManager;