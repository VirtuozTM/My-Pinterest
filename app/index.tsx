import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { hp, wp } from "@/helpers/common";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, interpolate } from "react-native-reanimated";
import { theme } from "@/constants/theme";
import { router } from "expo-router";
import {
  Canvas,
  Fill,
  LinearGradient as SkiaLG,
  vec,
  Group,
  Shadow,
  Mask,
  Rect,
  Turbulence,
} from "@shopify/react-native-skia";
import { Entypo } from "@expo/vector-icons";

const length = 7;
const STRIPES = new Array(length).fill(0).map((_, i) => i);

const WelcomeScreen = () => {
  const { height, width: wWidth } = useWindowDimensions();
  const width = wWidth / length;
  const origin = vec(width / 2, height / 2);
  const navigateToHomeScreen = () => {
    router.navigate("/home");
  };

  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1 }}>
        <Fill>
          <SkiaLG
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={["#1A0049", "#2F0604"]}
          />
        </Fill>
        <Group>
          <SkiaLG
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={["#5a5ec3", "#eba5c5", "#e1d4b7", "#e9b74c", "red"]}
          />
          <Shadow dx={0} dy={0} blur={10} color="black" />
          {STRIPES.map((_, i) => {
            return (
              <Group
                key={i}
                origin={origin}
                transform={[
                  {
                    scaleY: interpolate(
                      i,
                      [0, (length - 1) / 2, length - 1],
                      [1, 0.6, 1]
                    ),
                  },
                ]}
              >
                <Mask
                  mask={
                    <Rect x={i * width} y={0} width={width} height={height}>
                      <SkiaLG
                        start={vec(0, 0)}
                        end={vec(0, height)}
                        colors={[
                          "transparent",
                          "black",
                          "black",
                          "transparent",
                        ]}
                      />
                    </Rect>
                  }
                >
                  <Rect x={i * width} y={0} width={width} height={height} />
                </Mask>
              </Group>
            );
          })}
          <Fill blendMode={"softLight"}>
            <Turbulence freqX={1} freqY={1} octaves={3} />
          </Fill>
        </Group>
      </Canvas>
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.gradient}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)", "black", "black"]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />

        <View style={styles.content}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={styles.title}
          >
            My Pinterest
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            style={styles.punchline}
          >
            React Native | Armand PETIT
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Pressable
              onPress={navigateToHomeScreen}
              style={styles.startButton}
            >
              <Text style={styles.startText}>Explorer </Text>
              <Entypo name="arrow-with-circle-right" size={24} color="white" />
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: "absolute",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
  },
  title: {
    fontSize: hp(5),
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },
  punchline: {
    fontSize: hp(2),
    letterSpacing: 1,
    marginBottom: 10,
    color: theme.colors.white,
    fontWeight: theme.fontWeights.medium,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
    backgroundColor: theme.colors.neutral(0.4),
    padding: 15,
    paddingHorizontal: 40,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  startText: {
    color: theme.colors.white,
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 1,
  },
});
