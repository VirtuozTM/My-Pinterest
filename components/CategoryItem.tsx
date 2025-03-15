import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { act, memo } from "react";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import Animated, { FadeInRight } from "react-native-reanimated";
import { data } from "@/constants/data";

interface ICategoryItem {
  index: number;
  title: string;
  activeCategory: string | null;
  handleChangeCategory: (category: any) => void;
}

const CategoryItem = ({
  index,
  title,
  activeCategory,
  handleChangeCategory,
}: ICategoryItem) => {
  const isActive = activeCategory === title;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
      <Pressable
        onPress={() => handleChangeCategory(title)}
        style={[
          styles.category,
          {
            backgroundColor: isActive
              ? theme.colors.neutral(0.2)
              : theme.colors.black,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: isActive ? theme.colors.white : theme.colors.neutral(0.4),
            },
          ]}
        >
          {data.categoriesTranslations[title] || title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default memo(CategoryItem);

const styles = StyleSheet.create({
  category: {
    padding: 10,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.neutral(0.6),
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
  },
});
