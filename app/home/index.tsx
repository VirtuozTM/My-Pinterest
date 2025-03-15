import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "@/constants/theme";
import { getColumnCount, hp, wp } from "@/helpers/common";
import { data } from "@/constants/data";
import CategoryItem from "@/components/CategoryItem";
import { apiCall } from "@/api";
import { debounce } from "lodash";
import FiltersModal from "@/components/FiltersModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FetchImagesParams } from "@/types";
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
} from "react-native-reanimated";
import { MasonryFlashList, MasonryFlashListRef } from "@shopify/flash-list";
import ImageCard from "@/components/ImageCard";

var page = 1;

// Définissez le type Filters pour inclure une signature d'index
type Filters = {
  [key: string]: string; // Changez ici pour ne pas permettre undefined
  order: string; // Assurez-vous que ces propriétés sont définies comme string
  orientation: string;
  type: string;
  colors: string;
  category: string;
};

const HomeScreen = () => {
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState<Filters | null>(null);
  const filtersModalRef = useRef<BottomSheetModal>(null);
  const searchInputRef = useRef<TextInput>(null);
  const listRef = useRef<MasonryFlashListRef<any>>(null);
  const [showScrollUpButton, setShowScrollUpButton] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const columns = getColumnCount();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (
    params: FetchImagesParams = { page: 1 },
    append = true
  ) => {
    try {
      let res = await apiCall(params);
      if (res.success && res?.data?.hits) {
        setImages((prev) =>
          append ? [...prev, ...res.data.hits] : res.data.hits
        );
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const handleChangeCategory = useCallback(
    (cat: string) => {
      setActiveCategory((prevCategory) => (prevCategory === cat ? null : cat));
      clearSearch();
      setImages([]);
      page = 1;
      let params: FetchImagesParams = { page, ...filters };
      if (cat) params.category = cat;
      fetchImages(params, false);
    },
    [filters]
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    // Si l'utilisateur tape + de 2 caractères, on lance une recherche
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }
    // Si l'utilisateur efface tout, on relance la liste par défaut
    if (text === "") {
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  // Évite de spammer l'API à chaque frappe
  const handleSearchDebounce = useCallback(debounce(handleSearch, 400), []);
  const MIN_LOADING_DURATION = 1000; // en ms

  const handleEndReached = async () => {
    setLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    page += 1;
    let params: FetchImagesParams = { page, ...filters };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;

    // 3. On fait la requête
    await fetchImages(params, true);

    // 5. On désactive le spinner
    setLoadingMore(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    page = 1;
    setImages([]);

    let params: FetchImagesParams = { page, ...filters };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;

    await fetchImages(params, false); // false => on remplace la liste existante
    setRefreshing(false);
  };

  const handleListScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 200) {
      setShowScrollUpButton(true);
    } else {
      setShowScrollUpButton(false);
    }
  };

  const handleScrollUp = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      } as FetchImagesParams;
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeOpenFiltersModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      } as FetchImagesParams;
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeOpenFiltersModal();
  };

  const clearThisFilter = (filterName: keyof Filters) => {
    let filterS = { ...filters } as Filters;
    delete filterS[filterName];
    setFilters({ ...filterS });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterS,
    } as FetchImagesParams;
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const openOpenFiltersModal = useCallback(() => {
    filtersModalRef.current?.present();
  }, []);
  const closeOpenFiltersModal = useCallback(() => {
    filtersModalRef.current?.close();
  }, []);

  console.log(filters);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
            placeholder="Recherche de photos..."
            placeholderTextColor={theme.colors.neutral(0.4)}
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
                color={theme.colors.neutral(0.4)}
              />
            </Pressable>
          )}
        </View>
        <Pressable
          style={{
            padding: 8,
            backgroundColor: theme.colors.neutral(0.2),
            borderRadius: theme.radius.sm,
          }}
          onPress={openOpenFiltersModal}
        >
          <Ionicons name="filter" size={22} color={theme.colors.white} />
        </Pressable>
      </View>
      <View>
        <FlatList
          data={data.categories}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => {
            return (
              <CategoryItem
                index={index}
                title={item}
                activeCategory={activeCategory}
                handleChangeCategory={handleChangeCategory}
              />
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 0 }}
        />
      </View>
      {/* filters */}
      {filters && (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {(Object.keys(filters) as (keyof Filters)[]).map((key, index) => {
              return (
                <View key={key} style={styles.filterItem}>
                  {key == "colors" ? (
                    <View
                      style={{
                        height: 20,
                        width: 30,
                        backgroundColor: filters[key],
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <Text style={styles.filterItemText}>
                      {data.filtersTranslations[filters[key]] || filters[key]}
                    </Text>
                  )}

                  <Pressable
                    style={styles.filterCloseIcon}
                    onPress={() => clearThisFilter(key)}
                  >
                    <Ionicons
                      name="close"
                      size={14}
                      color={theme.colors.neutral(0.9)}
                    />
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      <MasonryFlashList
        ref={listRef}
        data={images}
        numColumns={columns}
        onScroll={handleListScroll}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={({ item, index }) => (
          <ImageCard item={item} columns={columns} index={index} />
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
        estimatedItemSize={200}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              style={{ marginTop: 30 }}
              color={"white"}
              size="large"
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="black"
            colors={["black"]}
          />
        }
      />

      {showScrollUpButton && (
        <Animated.View
          entering={SlideInUp.springify().damping(16)}
          exiting={SlideOutUp.springify()}
          style={styles.scrollUpButton}
        >
          <Pressable onPress={handleScrollUp}>
            <Ionicons name="arrow-up" size={25} color={theme.colors.black} />
          </Pressable>
        </Animated.View>
      )}
      <FiltersModal
        ref={filtersModalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeOpenFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    gap: 15,
    backgroundColor: theme.colors.black,
  },
  searchBar: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.neutral(0.8),
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    padding: 6,
    paddingLeft: 10,
    marginRight: 10,
  },
  searchIcon: { padding: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: hp(1.8),
    color: theme.colors.white,
  },
  closeIcon: {
    padding: 8,
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.sm,
  },
  filters: {
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.neutral(0.15),
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: { fontSize: hp(1.8), color: theme.colors.white },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: 7,
    padding: 4,
    borderCurve: "continuous",
  },
  scrollUpButton: {
    position: "absolute",
    top: 57.5,
    width: 40,
    height: 40,
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.black,
    backgroundColor: theme.colors.neutral(0.9),
    alignItems: "center",
    justifyContent: "center",
  },
});
