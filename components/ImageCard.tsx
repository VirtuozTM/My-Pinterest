import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { Image } from "expo-image";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getImageSize, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { router } from "expo-router";

interface ImageCardProps {
  item: {
    imageHeight: number;
    imageWidth: number;
    webformatURL: string;
    [key: string]: any;
  };
  index: number;
}

const ImageCard = ({ item, index }: ImageCardProps) => {
  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/home/image", params: { ...item } })
      }
      style={[styles.imageWrapper]}
    >
      <Image
        style={[styles.images, getImageHeight()]}
        source={{ uri: item?.webformatURL }}
        transition={100}
        cachePolicy="memory-disk"
        priority={index < 10 ? "high" : "low"}
      />
    </Pressable>
  );
};

export default memo(ImageCard);

const styles = StyleSheet.create({
  images: { height: 300, width: "100%" },
  imageWrapper: {
    margin: wp(0.5),
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
