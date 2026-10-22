# Week 5: Array & Object Manipulation Drills

## Project Overview

This project practices JavaScript array methods, object manipulation, data aggregation, and immutable updates using a sample food delivery orders dataset for Kigali Eats.

It also includes an interactive dashboard built with Vite and Tailwind CSS.

## Project Structure

- `data.js` — Sample order data.
- `drills.js` — Solutions to 25 array and object manipulation exercises.
- `dashboard/` — Interactive orders dashboard.

## Technologies Used

- JavaScript (ES modules)
- Array methods: `map()`, `filter()`, `find()`, `some()`, `every()`, and `reduce()`
- Object methods and grouping
- Vite
- Tailwind CSS

## How to Run the Drills

From the project root:

```bash
node drills.js
```

## How to Run the Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Production Build

From the `dashboard` folder:

```bash
npm run build
```

## Dashboard Features

- Delivered revenue and order statistics
- Average customer rating
- Best-selling menu item
- Revenue by district
- Orders table with status filters

## Testing

The drill output includes checks confirming that the original orders data remains unchanged after each station.


