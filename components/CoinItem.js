import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // אייקונים יציבים
import { toggleFavorite } from "functions/f1/toggleFavorite";

export default function CoinItem({
  coin,
  isFavorite,
  favorites,
  saveFavorites,
  setFavorites,
}) {
  return (
    <View style={styles.coinRow}>
      <Image source={{ uri: coin.image }} style={styles.coinImage} />
      <View style={styles.coinInfo}>
        <Text style={styles.coinName}>
          {coin.name} ({coin.symbol.toUpperCase()})
        </Text>
        <Text style={styles.coinPrice}>
          ${coin.current_price.toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          toggleFavorite({
            coinId: coin.id,
            favorites,
            saveFavorites,
            setFavorites,
          })
        }
      >
        <MaterialIcons
          name={isFavorite ? "star" : "star-border"}
          size={28}
          color={isFavorite ? "gold" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  coinImage: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: 16,
    fontWeight: "600",
  },
  coinPrice: {
    fontSize: 14,
    color: "#333",
  },
});
