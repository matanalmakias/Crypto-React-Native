import React, { useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CoinItem from "../components/CoinItem";
import { loadFavorites } from "functions/f1/loadFavorites";
import { saveFavorites } from "functions/f1/saveFavorites";
import { FavoritesContext } from "contexts/FavoriteContext";

export default function FavoritesScreen() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, setFavorites } = useContext(FavoritesContext);

  // כל פעם שנכנסים למסך -> טען מחדש
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          const favs = await loadFavorites();
          if (isActive) setFavorites(favs);

          const savedData = await AsyncStorage.getItem("coinsData");
          if (savedData) {
            const { coins: savedCoins } = JSON.parse(savedData);
            if (isActive) setCoins(savedCoins);
          }
        } catch (e) {
          console.error(e);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  const filteredCoins = coins.filter((coin) => favorites.includes(coin.id));

  return (
    <View style={styles.container}>
      {filteredCoins.length === 0 ? (
        <Text style={styles.noFavs}>No favorites yet ⭐</Text>
      ) : (
        <FlatList
          data={filteredCoins}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CoinItem
              favorites={favorites}
              saveFavorites={saveFavorites}
              setFavorites={setFavorites}
              coin={item}
              isFavorite={favorites.includes(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noFavs: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});
