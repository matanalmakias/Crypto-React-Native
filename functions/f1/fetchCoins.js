import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const fetchCoins = async ({
  force = false,
  savedLastRefresh,
  setCoins,
  setLastRefresh,
  setLoading,
  setCooldownLeft,
}) => {
  try {
    const savedData = await AsyncStorage.getItem("coinsData");
    if (savedData) {
      const { coins: savedCoins, lastRefresh: savedLastRefresh } =
        JSON.parse(savedData);

      if (!force && Date.now() - savedLastRefresh < 30000) {
        setCoins(savedCoins);
        setLastRefresh(savedLastRefresh);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 30,
          page: 1,
          sparkline: false,
        },
      }
    );

    setCoins(res.data);
    const now = Date.now();
    setLastRefresh(now);

    await AsyncStorage.setItem(
      "coinsData",
      JSON.stringify({ coins: res.data, lastRefresh: now })
    );

    // הפעלת קולדאון של 30 שניות
    setCooldownLeft(30);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
