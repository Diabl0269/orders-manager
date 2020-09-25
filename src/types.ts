enum Roles {
  KITCHEN,
  BAR
}

interface Order {
  name: string;
  table: string;
  orderTime: Date;
  id: string;
}

enum Routes {
  CHOOSE_ROLES,
  ORDERS_MANAGER,
}

export {Roles, Order, Routes}