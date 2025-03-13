import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./ImageCard";
import { getColumnCount, wp } from "@/helpers/common";

interface IImageGrid {
  images: any[];
}

const ImageGrid = ({ images }: IImageGrid) => {
  const columns = getColumnCount();

  return (
    <View style={{ minHeight: 3, width: Dimensions.get("screen").width }}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item, index }) => (
          <ImageCard item={item} columns={columns} index={index} />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: wp(4),
  },
});
