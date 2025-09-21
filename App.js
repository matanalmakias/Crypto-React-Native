import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CoinsScreen from "./screens/CoinsScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { FavoritesProvider } from "contexts/FavoriteContext";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Coins"
            component={CoinsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="list" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="star" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </FavoritesProvider>
  );
}
