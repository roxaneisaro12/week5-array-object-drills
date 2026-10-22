
import './style.css';
import { orders } from '../../data.js';

// Calculate an order's total without changing the original data.
const orderTotal = ({ items }) =>
  items.reduce((sum, { price, qty }) => sum + price * qty, 0);

const deliveredOrders = orders.filter(
  ({ status }) => status === 'delivered'
);

const totalRevenue = deliveredOrders.reduce(
  (sum, order) => sum + orderTotal(order),
  0
);

const ratedOrders = deliveredOrders.filter(
  ({ rating }) => rating !== null
);

const averageRating = ratedOrders.length
  ? (
      ratedOrders.reduce((sum, { rating }) => sum + rating, 0) /
      ratedOrders.length
    ).toFixed(1)
  : '0.0';

// Count sold quantities for each menu item.
const itemSales = orders
  .filter(({ status }) => status === 'delivered')
  .flatMap(({ items }) => items)
  .reduce((sales, { name, qty }) => ({
    ...sales,
    [name]: (sales[name] || 0) + qty
  }), {});

const bestSellingItem = Object.entries(itemSales)
  .toSorted((a, b) => b[1] - a[1])[0];

const revenueByDistrict = deliveredOrders.reduce(
  (revenue, order) => ({
    ...revenue,
    [order.customer.district]:
      (revenue[order.customer.district] || 0) + orderTotal(order)
  }),
  {}
);

const money = (amount) => `${amount.toLocaleString('en-US')} RWF`;

const statusClasses = {
  delivered: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-rose-100 text-rose-800'
};

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
    <header class="mx-auto mb-8 max-w-7xl">
      <p class="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
        Kigali Eats · Operations
      </p>
      <div class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
            Orders Dashboard
          </h1>
          <p class="mt-2 text-slate-500">
            An overview of deliveries, customers and revenue.
          </p>
        </div>
        <span class="w-fit rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          October 2026
        </span>
      </div>
    </header>

    <section class="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-2xl bg-white p-6 shadow-sm">
        <p class="text-sm text-slate-500">Delivered revenue</p>
        <p class="mt-3 text-2xl font-bold">${money(totalRevenue)}</p>
        <p class="mt-2 text-sm text-emerald-700">Completed orders only</p>
      </article>

      <article class="rounded-2xl bg-white p-6 shadow-sm">
        <p class="text-sm text-slate-500">Delivered orders</p>
        <p class="mt-3 text-2xl font-bold">${deliveredOrders.length}</p>
        <p class="mt-2 text-sm text-slate-500">Successfully completed</p>
      </article>

      <article class="rounded-2xl bg-white p-6 shadow-sm">
        <p class="text-sm text-slate-500">Average rating</p>
        <p class="mt-3 text-2xl font-bold">${averageRating} / 5</p>
        <p class="mt-2 text-sm text-slate-500">Rated delivered orders</p>
      </article>

      <article class="rounded-2xl bg-white p-6 shadow-sm">
        <p class="text-sm text-slate-500">Best-selling item</p>
        <p class="mt-3 text-2xl font-bold">${bestSellingItem?.[0] ?? 'N/A'}</p>
        <p class="mt-2 text-sm text-slate-500">
          ${bestSellingItem?.[1] ?? 0} items sold
        </p>
      </article>
    </section>

    <div class="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-5">
      <section class="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
        <h2 class="text-lg font-bold">Revenue by district</h2>
        <p class="mt-1 text-sm text-slate-500">Delivered orders · RWF</p>
        <div id="revenue-chart" class="mt-6 space-y-5"></div>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm xl:col-span-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-bold">Orders</h2>
            <p class="mt-1 text-sm text-slate-500">Browse and filter all orders</p>
          </div>
          <span id="order-count" class="text-sm text-slate-500"></span>
        </div>

        <div id="filters" class="mt-5 flex flex-wrap gap-2">
          ${['all', 'delivered', 'pending', 'cancelled'].map((status) => `
            <button
              type="button"
              data-status="${status}"
              aria-pressed="${status === 'all'}"
              class="filter-btn rounded-full border border-slate-200 px-4 py-2 text-sm font-medium capitalize transition hover:border-emerald-600"
            >${status === 'all' ? 'All orders' : status}</button>
          `).join('')}
        </div>

        <div class="mt-5 overflow-x-auto">
          <table class="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-slate-500">
                <th class="px-3 py-3 font-medium">Order</th>
                <th class="px-3 py-3 font-medium">Customer</th>
                <th class="px-3 py-3 font-medium">District</th>
                <th class="px-3 py-3 font-medium">Total</th>
                <th class="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody id="orders-table"></tbody>
          </table>
        </div>
      </section>
    </div>

    <footer class="mx-auto mt-8 max-w-7xl pb-4 text-center text-sm text-slate-400">
      Kigali Eats · Workshop 1 · Array & Object Manipulation
    </footer>
  </main>
`;

// Render the revenue bars.
const maxRevenue = Math.max(...Object.values(revenueByDistrict), 1);

document.querySelector('#revenue-chart').innerHTML =
  Object.entries(revenueByDistrict)
    .toSorted((a, b) => b[1] - a[1])
    .map(([district, revenue]) => `
      <div>
        <div class="mb-2 flex justify-between gap-3 text-sm">
          <span class="font-medium">${district}</span>
          <span class="text-slate-500">${money(revenue)}</span>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full bg-emerald-600"
            style="width: ${(revenue / maxRevenue) * 100}%"
          ></div>
        </div>
      </div>
    `).join('');

// Render the table according to the selected filter.
// innerHTML is acceptable here because this workshop uses our own trusted dataset.
function renderOrders(status = 'all') {
  const filteredOrders = status === 'all'
    ? orders
    : orders.filter((order) => order.status === status);

  document.querySelector('#order-count').textContent =
    `${filteredOrders.length} orders`;

  document.querySelector('#orders-table').innerHTML =
    filteredOrders.map((order) => `
      <tr class="border-b border-slate-50 transition hover:bg-slate-50">
        <td class="px-3 py-4 font-semibold">#${order.id}</td>
        <td class="px-3 py-4">${order.customer.name}</td>
        <td class="px-3 py-4 text-slate-500">${order.customer.district}</td>
        <td class="whitespace-nowrap px-3 py-4 font-medium">${money(orderTotal(order))}</td>
        <td class="px-3 py-4">
          <span class="rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[order.status]}">
            ${order.status}
          </span>
        </td>
      </tr>
    `).join('');
}

// Connect the filter buttons to the table.
document.querySelector('#filters').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-status]');
  if (!button) return;

  const status = button.dataset.status;

  document.querySelectorAll('.filter-btn').forEach((filterButton) => {
    const selected = filterButton === button;
    filterButton.setAttribute('aria-pressed', String(selected));
    filterButton.classList.toggle('bg-emerald-700', selected);
    filterButton.classList.toggle('text-white', selected);
    filterButton.classList.toggle('bg-white', !selected);
  });

  renderOrders(status);
});

// Show all orders when the page first loads.
document.querySelectorAll('.filter-btn').forEach((button) => {
  button.classList.toggle('bg-emerald-700', button.dataset.status === 'all');
  button.classList.toggle('text-white', button.dataset.status === 'all');
  button.classList.toggle('bg-white', button.dataset.status !== 'all');
});

renderOrders();
