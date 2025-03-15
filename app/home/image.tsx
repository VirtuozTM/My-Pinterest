import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { hp, wp } from "@/helpers/common";
import { Image } from "expo-image";
import { theme } from "@/constants/theme";
import { Entypo, Octicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast, { ToastConfig } from "react-native-toast-message";
import * as MediaLibrary from "expo-media-library";

const ImageScreen = () => {
  const item = useLocalSearchParams() as any;
  const [status, setStatus] = useState("loading");
  const fileName = item?.previewURL?.split("/").pop();
  const imageUrl = item?.webformatURL;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;

    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      calculatedHeight = calculatedHeight * aspectRatio;
    }

    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const onLoad = () => {
    setStatus("");
  };

  const handleDownloadImage = async () => {
    if (Platform.OS === "web") {
      const anchor = document.createElement("a");
      anchor.href = imageUrl;
      anchor.target = "_blank";
      anchor.download = fileName || "download";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return;
    }
    setStatus("downloading");
    let uri = await downloadFile();
    if (uri) showToast("Image Téléchargée");
  };

  const handleShareImage = async () => {
    if (Platform.OS === "web") {
      showToast("Link copied");
      return;
    }
    setStatus("sharing");
    let uri = await downloadFile();
    if (uri) {
      // share image
      await Sharing.shareAsync(uri);
    }
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      console.log("downloaded at: ", uri);

      if (Platform.OS !== "web") {
        if (!permissionResponse || permissionResponse.status !== "granted") {
          const permission = await requestPermission();
          if (!permission.granted) {
            showToast("Permission d'accès à la galerie refusée");
            setStatus("");
            return uri;
          }
        }

        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("Pixabay", asset, false);
        console.log("Sauvegardé dans la galerie:", asset);
      }

      setStatus("");
      return uri;
    } catch (err: any) {
      console.log("got error", err.message);
      setStatus("");
      Alert.alert("Image", err.message);
      return null;
    }
  };

  const showToast = (message: string) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "bottom",
    });
  };

  const toastConfig: ToastConfig = {
    success: ({ text1, props }) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
  };
  return (
    <View style={{ flex: 1 }}>
      <BlurView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: wp(4),
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        experimentalBlurMethod="dimezisBlurView"
        intensity={60}
        tint="dark"
      >
        <View style={getSize()}>
          <View style={styles.loading}>
            {status == "loading" && (
              <ActivityIndicator size={"large"} color={"white"} />
            )}
          </View>
          <Image
            source={{ uri: item?.webformatURL }}
            transition={100}
            style={[styles.image, getSize()]}
            onLoad={onLoad}
          />
        </View>

        <View style={styles.buttons}>
          <Animated.View
            entering={FadeInDown.springify()}
            style={styles.button}
          >
            <Pressable onPress={() => router.back()}>
              <Octicons name="x" size={24} color="white" />
            </Pressable>
          </Animated.View>
          <Animated.View entering={FadeInDown.springify()}>
            {status == "downloading" ? (
              <View style={styles.button}>
                <ActivityIndicator size={"small"} color={"white"} />
              </View>
            ) : (
              <Pressable style={styles.button} onPress={handleDownloadImage}>
                <Octicons name="download" size={24} color="white" />
              </Pressable>
            )}
          </Animated.View>
          <Animated.View entering={FadeInDown.springify()}>
            {status == "sharing" ? (
              <View style={styles.button}>
                <ActivityIndicator size={"small"} color={"white"} />
              </View>
            ) : (
              <Pressable style={styles.button} onPress={handleShareImage}>
                <Entypo name="share" size={24} color="white" />
              </Pressable>
            )}
          </Animated.View>
        </View>
      </BlurView>
      <Toast config={toastConfig} visibilityTime={2500} />
    </View>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    width: "100%",
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.grayBG,
  },
});
