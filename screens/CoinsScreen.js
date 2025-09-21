import React, { useContext, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker"; // במקום מ-react-native

import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CoinItem from "../components/CoinItem";
import { saveFavorites } from "functions/f1/saveFavorites";
import { loadFavorites } from "functions/f1/loadFavorites";
import { getSortedCoins } from "functions/f1/getSortedCoins";
import { fetchCoins } from "functions/f1/fetchCoins";
import { FavoritesContext } from "contexts/FavoriteContext";

export default function CoinsScreen() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [sortOption, setSortOption] = useState("market_cap"); // ברירת מחדל
  const [cooldownLeft, setCooldownLeft] = useState(0); // כמה שניות נשארו
  const { favorites, setFavorites } = useContext(FavoritesContext);
  useEffect(() => {
    loadFavorites({ setFavorites });
    fetchCoins({
      setCoins,
      setLastRefresh,
      setLoading,
      setCooldownLeft,
    });
  }, []);

  // אפקט לספירה לאחור
  useEffect(() => {
    if (cooldownLeft <= 0) return;

    const interval = setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownLeft]);

  if (loading && coins.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading coins...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* כפתור ריענון */}
      <TouchableOpacity
        style={[
          styles.refreshButton,
          cooldownLeft > 0 && styles.refreshButtonDisabled,
        ]}
        onPress={() =>
          fetchCoins({
            force: true,
            setCoins,
            setLastRefresh,
            setLoading,
            setCooldownLeft,
          })
        }
        disabled={cooldownLeft > 0}
      >
        <Text style={styles.refreshButtonText}>
          {cooldownLeft > 0 ? `Wait ${cooldownLeft}s...` : "Refresh Coins"}
        </Text>
      </TouchableOpacity>

      {/* טקסט זמן עדכון */}
      <Text style={styles.lastUpdated}>
        Last updated:{" "}
        {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : "Never"}
      </Text>

      {/* בורר מיון */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <Picker
          selectedValue={sortOption}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          mode="dropdown"
          onValueChange={(itemValue) => setSortOption(itemValue)}
        >
          <Picker.Item label="Market Cap" value="market_cap" />
          <Picker.Item label="Name (A-Z)" value="name" />
          <Picker.Item label="Price (High → Low)" value="price" />
          <Picker.Item label="24h Change (High → Low)" value="change" />
        </Picker>
      </View>

      {/* רשימת מטבעות */}
      <FlatList
        data={getSortedCoins({ coins, sortOption })}
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
  lastUpdated: {
    marginVertical: 8,
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: "blue",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  refreshButtonDisabled: {
    backgroundColor: "gray",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sortLabel: {
    fontSize: 14,
    marginRight: 8,
  },

  picker: {
    flex: 1,
    height: 60,
    color: "#000", // טקסט שחור
  },
  pickerItem: {
    fontSize: 14,
    color: "#000",
  },
});
