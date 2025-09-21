import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("favorites");
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    return [];
  } catch (e) {
    console.error("Error loading favorites", e);
    return [];
  }
};
