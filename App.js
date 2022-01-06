import * as Location from "expo-location";
// expo-location 공식문서에 자세히 나와 있음
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Fontisto, Entypo } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "fe3d924d063eacc109000d5a1482a13b";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const GetWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    // console.log(location);
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    GetWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar stlye="light" />
      {ok === false ? (
        <View style={styles.city}>
          <Entypo name="emoji-sad" size={208} color="#fbc531" />
          <Text style={{ ...styles.cityName, color: "#353b48" }}>Sorry,</Text>
          <Text style={{ ...styles.cityName, fontSize: 40, color: "#353b48" }}>
            please restart
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
          </View>
          <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wether}
          >
            {days.length === 0 ? (
              <View style={{ ...styles.day, alignItems: "center" }}>
                <ActivityIndicator
                  color="#f5f6fa"
                  style={{ marginTop: 10 }}
                  size="large"
                />
              </View>
            ) : (
              days.map((day, index) => (
                <View key={index} style={styles.day}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.temp}>
                      {parseFloat(day.temp.day).toFixed(1)}
                    </Text>
                    <Fontisto
                      name={icons[day.weather[0].main]}
                      size={98}
                      color="#fbc531"
                    />
                  </View>
                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>
                    {day.weather[0].description}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00a8ff",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "800",
    color: "#f5f6fa",
  },
  wether: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 50,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
    color: "#f5f6fa",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "#f5f6fa",
    fontWeight: "500",
  },
  tinyText: {
    fontSize: 25,
    marginTop: -5,
    color: "#f5f6fa",
    fontWeight: "500",
  },
});
