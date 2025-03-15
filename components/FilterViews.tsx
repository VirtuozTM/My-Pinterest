import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { capitalize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { data as dataApp } from "@/constants/data";

type SectionViewProps = {
  title: string;
  content: React.ReactNode;
};

const SectionView = ({ title, content }: SectionViewProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

type CommonFilterRowProps = {
  data: string[]; // Le tableau de données à afficher
  filterName: string; // Nom du filtre (e.g. "colors", "order", etc.)
  filters: Record<string, any> | null; // L'objet qui contient tous les filtres actifs
  setFilters: (f: Record<string, any> | null) => void;
};

export const CommonFilterRow = ({
  data,
  filterName,
  filters,
  setFilters,
}: CommonFilterRowProps) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let backgroundColor = isActive ? theme.colors.neutral(0.9) : "black";
          let color = isActive ? "black" : theme.colors.neutral(0.9);
          return (
            <Pressable
              key={item}
              onPress={() => onSelect(item)}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {dataApp.filtersTranslations[item] || capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilter = ({
  data,
  filterName,
  filters,
  setFilters,
}: CommonFilterRowProps) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let borderColor = isActive ? theme.colors.neutral(0.4) : "black";
          return (
            <Pressable key={item} onPress={() => onSelect(item)}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]} />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

export default SectionView;

const styles = StyleSheet.create({
  sectionContainer: { gap: 8 },
  sectionTitle: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
  },
  outlined: {},
  flexRowWrap: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
  },
  outlinedButtonText: {
    fontSize: hp(1.8),
  },

  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
  colorWrapper: {
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderCurve: "continuous",
  },
});
