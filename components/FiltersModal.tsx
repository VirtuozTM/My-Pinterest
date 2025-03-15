import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolate,
  Extrapolation,
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import SectionView, { ColorFilter, CommonFilterRow } from "./FilterViews";
import { data } from "@/constants/data";
import { Filters } from "@/types";

export type Ref = BottomSheetModal;

interface FiltersModalProps {
  filters: Filters | null;
  setFilters: React.Dispatch<React.SetStateAction<Filters | null>>;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
}

const FiltersModal = forwardRef<Ref, FiltersModalProps>(
  ({ filters, setFilters, onClose, onApply, onReset }, ref) => {
    const handleSheetChanges = useCallback((index: number) => {
      console.log("handleSheetChanges", index);
    }, []);

    const snapPoints = useMemo(() => ["75%"], []);

    return (
      <BottomSheetModal
        ref={ref}
        onChange={handleSheetChanges}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing
        backdropComponent={(props) => (
          <CustomBackdrop {...props} onClose={onClose} />
        )}
        backgroundComponent={CustomBackground}
        handleIndicatorStyle={{ backgroundColor: theme.colors.neutral(0.4) }}
        handleStyle={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          paddingVertical: 14,
          borderTopStartRadius: 15,
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.content}>
            <Text style={styles.filterText}>Filtre</Text>
            {(Object.keys(sections) as SectionName[]).map(
              (sectionName, index) => {
                let sectionView = sections[sectionName];
                let sectionData = data.filters[sectionName];
                let title = capitalize(sectionName);
                return (
                  <Animated.View
                    entering={FadeInDown.delay(index * 100)
                      .springify()
                      .damping(11)}
                    key={sectionName}
                  >
                    <SectionView
                      title={data.filtersTranslations[sectionName]}
                      content={sectionView({
                        data: sectionData,
                        filters,
                        setFilters,
                        filterName: sectionName,
                      })}
                    />
                  </Animated.View>
                );
              }
            )}

            <Animated.View
              entering={FadeInDown.delay(500).springify().damping(11)}
              style={styles.buttons}
            >
              <Pressable style={styles.resetButton} onPress={onReset}>
                <Text
                  style={[
                    styles.resetButtonText,
                    { color: theme.colors.neutral(0.9) },
                  ]}
                >
                  Réinitialiser
                </Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={onApply}>
                <Text
                  style={[
                    styles.applyButtonText,
                    { color: theme.colors.white },
                  ]}
                >
                  Appliquer
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

type SectionName = "order" | "orientation" | "type" | "colors";

const sections: Record<SectionName, (props: any) => JSX.Element> = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilter {...props} />,
};

const CustomBackdrop = ({
  animatedIndex,
  style,
  onClose,
}: BottomSheetBackdropProps & { onClose: () => void }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });
  const containerStyle = useMemo(
    () => [
      style,
      StyleSheet.absoluteFill,
      styles.overlay,
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView
          style={StyleSheet.absoluteFill}
          experimentalBlurMethod="dimezisBlurView"
          intensity={25}
          tint="dark"
        />
      </Pressable>
    </Animated.View>
  );
};

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View
      style={[
        style,
        {
          backgroundColor: theme.colors.black,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.black,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.6),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.neutral(0.8),
  },
  applyButtonText: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.semibold,
    textAlign: "center",
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.1),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.neutral(0.2),
  },
  resetButtonText: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.semibold,
  },
});

export default FiltersModal;
