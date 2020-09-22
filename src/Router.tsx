import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import ChooseRoles from "./routes/ChooseRoles";
import OrdersManager from "./routes/OrdersManager";
import { shouldBeOverridden } from "./utils";

enum Routes {
  CHOOSE_ROLES,
  ORDERS_MANAGER,
}

interface Context {
  setRoute: Dispatch<SetStateAction<Routes>>;
}

const initialContext: Context = {
  setRoute: shouldBeOverridden,
};

const RouterContext = createContext(initialContext);
const Router = () => {
  const [route, setRoute] = useState<Routes>(Routes.ORDERS_MANAGER);
    console.log('hello world');
    
    // Change login in case there are more routes
    const page = useMemo(() => {
        return route === Routes.ORDERS_MANAGER ? <OrdersManager /> : <ChooseRoles />
    }, [route])

  return (
    <RouterContext.Provider value={{ setRoute }}>
      {page}
    </RouterContext.Provider>
  );
};

const useRouter = () => useContext(RouterContext);

export { Router, useRouter, Routes };
