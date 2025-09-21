export const getSortedCoins = ({ coins, sortOption }) => {
  let sorted = [...coins];
  switch (sortOption) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "price":
      sorted.sort((a, b) => b.current_price - a.current_price);
      break;
    case "change":
      sorted.sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
      break;
    case "market_cap":
    default:
      sorted.sort((a, b) => b.market_cap - a.market_cap);
      break;
  }
  return sorted;
};
