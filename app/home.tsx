import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Categories from "@/components/CategoryItem";
import { data } from "@/constants/data";
import CategoryItem from "@/components/CategoryItem";
import { apiCall } from "@/api";
import ImageGrid from "@/components/ImageGrid";
import { debounce } from "lodash";

var page = 1;

type FetchImagesParams = {
  page: number;
  q?: string;
  category?: string;
};

const HomeScreen = () => {
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [images, setImages] = useState([]);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (
    params: FetchImagesParams = { page: 1 },
    append = false
  ) => {
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      setImages(append ? [...images, ...res.data.hits] : res.data.hits);
    }
  };

  const handleChangeCategory = useCallback((cat: string) => {
    setActiveCategory((prevCategory) => (prevCategory === cat ? null : cat));
    clearSearch();
    setImages([]);
    page = 1;
    let params: FetchImagesParams = {
      page,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      // search for this text
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text });
    }
    if (text === "") {
      // reset results
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page });
    }
  };

  // Évite de spammer l’API à chaque frappe de l’utilisateur en ajoutant un délai de 400 ms après la dernière frappe avant de déclencher la requête.
  const handleSearchDebounce = useCallback(debounce(handleSearch, 400), []);

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ gap: 15 }}>
        <View style={styles.searchBar}>
          <View>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
              style={styles.searchIcon}
            />
          </View>
          <TextInput
            placeholder="Search for photos..."
            // value={search}
            ref={searchInputRef}
            onChangeText={handleSearchDebounce}
            style={styles.searchInput}
          />
          {search && (
            <Pressable
              onPress={() => handleSearch("")}
              style={styles.closeIcon}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.categories}>
          <FlatList
            data={data.categories}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <CategoryItem
                index={index}
                title={item}
                activeCategory={activeCategory}
                handleChangeCategory={handleChangeCategory}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
          />
        </View>
        {/* mansory layout */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    gap: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: hp(3.5),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    padding: 6,
    paddingLeft: 10,
  },
  searchIcon: { padding: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: hp(1.8) },
  closeIcon: {
    padding: 8,
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.sm,
  },
  categories: {},
});
