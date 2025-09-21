export const toggleFavorite = ({
  coinId,
  favorites,
  setFavorites,
  saveFavorites,
}) => {
  let newFavorites = [];
  if (favorites.includes(coinId)) {
    newFavorites = favorites.filter((id) => id !== coinId);
  } else {
    newFavorites = [...favorites, coinId];
  }
  setFavorites(newFavorites);
  saveFavorites(newFavorites);
};
