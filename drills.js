
import { orders } from "./data.js";

const ORIGINAL = JSON.stringify(orders);

// Station 1: Warm-up

// 1. Array of all order IDs
const orderIds = orders.map(({ id }) => id);
console.log("1. Order IDs:", orderIds);

// 2. Customer names, including duplicates
const customerNames = orders.map(({ customer }) => customer.name);
console.log("2. Customer names:", customerNames);

// 3. All delivered orders
const deliveredOrders = orders.filter(
  ({ status }) => status === "delivered"
);
console.log("3. Delivered orders:", deliveredOrders);

// 4. All orders from Gasabo
const gasaboOrders = orders.filter(
  ({ customer }) => customer.district === "Gasabo"
);
console.log("4. Gasabo orders:", gasaboOrders);

// 5. Find the order with ID 106
const order106 = orders.find(({ id }) => id === 106);
console.log("5. Order 106:", order106);

// 6. Does any order have a rating of 3 or lower?
const hasLowRating = orders.some(
  ({ rating }) => rating !== null && rating <= 3
);
console.log("6. Has rating of 3 or lower:", hasLowRating);

// 7. Are all pending orders unrated?
const pendingOrdersUnrated = orders
  .filter(({ status }) => status === "pending")
  .every(({ rating }) => rating === null);
console.log("7. Pending orders are unrated:", pendingOrdersUnrated);

// 8. Unique customer names
const uniqueCustomerNames = [
  ...new Set(customerNames)
];
console.log("8. Unique names:", uniqueCustomerNames);

// Confirm the original data was not changed.
console.log(
  "Station 1 unchanged:",
  JSON.stringify(orders) === ORIGINAL
);


 // Station 2: Calculations with reduce

// Helper: calculate the total price of one order
const orderTotal = ({ items }) =>
  items.reduce(
    (sum, { price, qty }) => sum + price * qty,
    0
  );

// 9. Add a total to every order without changing originals
const ordersWithTotals = orders.map((order) => ({
  ...order,
  total: orderTotal(order)
}));

console.log(
  "9. Orders with totals:",
  ordersWithTotals
);

// 10. Total revenue from delivered orders only
const deliveredRevenue = orders
  .filter(({ status }) => status === "delivered")
  .reduce(
    (sum, order) => sum + orderTotal(order),
    0
  );

console.log(
  "10. Delivered revenue:",
  deliveredRevenue
);

// 11. Average rating, ignoring null ratings
const ratedOrders = orders.filter(
  ({ rating }) => rating !== null
);

const averageRating =
  ratedOrders.length === 0
    ? 0
    : Number(
        (
          ratedOrders.reduce(
            (sum, { rating }) => sum + rating,
            0
          ) / ratedOrders.length
        ).toFixed(1)
      );

console.log("11. Average rating:", averageRating);

// 12. Total quantity of Brochettes sold
const brochettesSold = orders
  .flatMap(({ items }) => items)
  .filter(({ name }) => name === "Brochette")
  .reduce((sum, { qty }) => sum + qty, 0);

console.log(
  "12. Brochettes sold:",
  brochettesSold
);

// 13. The single most expensive order
const mostExpensiveOrder = ordersWithTotals.reduce(
  (mostExpensive, order) =>
    order.total > mostExpensive.total
      ? order
      : mostExpensive
);

console.log(
  "13. Most expensive order:",
  mostExpensiveOrder
);

// 14. Number of orders per status
const ordersByStatus = orders.reduce(
  (counts, { status }) => ({
    ...counts,
    [status]: (counts[status] || 0) + 1
  }),
  {}
);

console.log(
  "14. Orders by status:",
  ordersByStatus
);

// Confirm the original data is still unchanged
console.log(
  "Station 2 unchanged:",
  JSON.stringify(orders) === ORIGINAL
);


// Station 3: Grouping and Ranking

// 15. Revenue per district from delivered orders
const revenueByDistrict = orders
  .filter(({ status }) => status === "delivered")
  .reduce((revenue, { customer, ...order }) => ({
    ...revenue,
    [customer.district]:
      (revenue[customer.district] || 0) + orderTotal(order)
  }), {});

console.log("15. Revenue by district:", revenueByDistrict);

// 16. Group orders by date and calculate count and revenue
const groupedByDate = Object.groupBy(
  orders,
  ({ date }) => date
);

const dailySummary = Object.entries(groupedByDate).map(
  ([date, dailyOrders]) => ({
    date,
    count: dailyOrders.length,
    revenue: dailyOrders
      .filter(({ status }) => status === "delivered")
      .reduce((sum, order) => sum + orderTotal(order), 0)
  })
);

console.log("16. Daily summary:", dailySummary);

// 17. Top 3 best-selling items by quantity
const itemQuantities = orders
  .flatMap(({ items }) => items)
  .reduce((totals, { name, qty }) => ({
    ...totals,
    [name]: (totals[name] || 0) + qty
  }), {});

const topThreeItems = Object.entries(itemQuantities)
  .map(([name, qty]) => ({ name, qty }))
  .toSorted((a, b) => b.qty - a.qty)
  .slice(0, 3);

console.log("17. Top 3 items:", topThreeItems);

// 18. Each customer's number of orders and total spent
const customerSummary = Object.entries(
  orders.reduce((customers, { customer, ...order }) => {
    const name = customer.name;

    return {
      ...customers,
      [name]: {
        name,
        orders: (customers[name]?.orders || 0) + 1,
        spent:
          (customers[name]?.spent || 0) +
          (order.status === "delivered" ? orderTotal(order) : 0)
      }
    };
  }, {})
)
  .map(([, summary]) => summary)
  .toSorted((a, b) => b.spent - a.spent);

console.log("18. Customer summary:", customerSummary);

// 19. Menu price list using Object.fromEntries
const menuPrices = Object.fromEntries(
  orders
    .flatMap(({ items }) => items)
    .map(({ name, price }) => [name, price])
    .filter((item, index, items) =>
      items.findIndex(([itemName]) => itemName === item[0]) === index
    )
);

console.log("19. Menu prices:", menuPrices);

// Verify original orders are unchanged
console.log(
  "Station 3 unchanged:",
  JSON.stringify(orders) === ORIGINAL
);


// Station 4: Immutable Updates

// 20. Mark a pending order as delivered
function markDelivered(orders, id) {
  return orders.map((order) =>
    order.id === id && order.status === "pending"
      ? { ...order, status: "delivered" }
      : order
  );
}

// 21. Rate an order only if it is delivered
function rateOrder(orders, id, rating) {
  return orders.map((order) =>
    order.id === id && order.status === "delivered"
      ? { ...order, rating }
      : order
  );
}

// 22. Change a customer's district
function changeDistrict(orders, id, district) {
  return orders.map((order) =>
    order.id === id
      ? {
          ...order,
          customer: {
            ...order.customer,
            district
          }
        }
      : order
  );
}

// 23. Add an item to an order
function addItem(orders, id, item) {
  return orders.map((order) =>
    order.id === id
      ? {
          ...order,
          items: [...order.items, { ...item }]
        }
      : order
  );
}

// 24. Remove cancelled orders
function removeCancelled(orders) {
  return orders.filter(
    ({ status }) => status !== "cancelled"
  );
}

// 25. Apply a discount to every item price
function applyDiscount(orders, percent) {
  return orders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      price: Math.round(item.price * (1 - percent / 100))
    }))
  }));
}

// Test the functions
console.log("20. Mark delivered:", markDelivered(orders, 105));
console.log("21. Rate delivered order:", rateOrder(orders, 101, 4));
console.log("21. Rate pending order:", rateOrder(orders, 105, 5));
console.log("22. Change district:", changeDistrict(orders, 101, "Kicukiro"));
console.log("23. Add item:", addItem(orders, 101, {
  name: "Water",
  price: 500,
  qty: 1
}));
console.log("24. Remove cancelled:", removeCancelled(orders));
console.log("25. Apply discount:", applyDiscount(orders, 10));

// Verify original orders remain unchanged
console.log(
  "Station 4 unchanged:",
  JSON.stringify(orders) === ORIGINAL
);
