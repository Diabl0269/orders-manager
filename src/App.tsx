import React from "react";
import { OrdersProvider } from "./providers/OrdersProvider";
import { ScreenProvider } from "./providers/ScreenProvider";
import { Router } from "./Router";

const App = () => {
  return (
    <OrdersProvider>
      <ScreenProvider>
        <Router />
      </ScreenProvider>
    </OrdersProvider>
  );
};

export default App;
