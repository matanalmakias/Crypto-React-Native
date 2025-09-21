import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveFavorites = async (newFavorites) => {
  try {
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  } catch (e) {
    console.error("Error saving favorites", e);
  }
};
