import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

type UploadMethodItemProps = {
  selected: boolean;
  title: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  onFileChange: (uri?: string) => void;
  status?: string;
};

export default function UploadMethodItem({
  selected,
  title,
  icon,
  onSelect,
  onFileChange,
  status,
}: UploadMethodItemProps) {
  const [uri, setUri] = useState<string | undefined>();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
      allowsEditing: true,
    });

    if (result.canceled) return;
    const fileUri = result.assets[0]?.uri;
    setUri(fileUri);
    onFileChange(fileUri);
  };

  const canUpload = ["", "failed", "rejected"].includes(
    String(status || "").toLowerCase(),
  );

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.selectorRow, selected && styles.selectorRowSelected]}
        onPress={canUpload ? onSelect : undefined}
      >
        <View style={styles.selectorLeft}>
          <View style={styles.iconWrap}>{icon}</View>
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        </View>

        <View style={styles.selectorRight}>
          {status ? (
            <View style={styles.pill}>
              <ThemedText style={styles.pillText}>{status} Approval</ThemedText>
            </View>
          ) : null}

          {canUpload ? (
            <View
              style={[
                styles.selectRing,
                selected ? styles.selectRingActive : undefined,
              ]}
            >
              <View
                style={[
                  styles.selectDot,
                  selected ? styles.selectDotActive : undefined,
                ]}
              />
            </View>
          ) : null}
        </View>
      </Pressable>

      {selected && canUpload && (
        <View style={styles.body}>
          {!uri ? (
            <Pressable style={styles.uploadCard} onPress={pickImage}>
              <ThemedText type="defaultSemiBold" style={styles.uploadTitle}>
                Click here to upload {title}
              </ThemedText>
              <ThemedText style={styles.uploadHint}>
                PNG, JPG (max. 10MB)
              </ThemedText>
            </Pressable>
          ) : (
            <View style={styles.fileCard}>
              <View style={styles.fileMeta}>
                <Image source={{ uri }} style={styles.preview} />
                <View style={{ flex: 1 }}>
                  <ThemedText
                    numberOfLines={1}
                    type="defaultSemiBold"
                    style={styles.fileName}
                  >
                    {uri.split("/").pop()}
                  </ThemedText>
                  <ThemedText style={styles.fileSubtext}>
                    Ready for upload
                  </ThemedText>
                </View>
              </View>

              <BraneButton
                text="Change Document"
                onPress={pickImage}
                height={36}
                backgroundColor="#D2F1E4"
                textColor="#013D25"
                style={{ marginTop: 10 }}
              />
            </View>
          )}

          {uri ? (
            <Pressable
              onPress={() => {
                setUri(undefined);
                onFileChange(undefined);
              }}
            >
              <ThemedText style={styles.clearFile}>
                Remove selected file
              </ThemedText>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
  },
  selectorRow: {
    borderWidth: 1,
    borderColor: "#F7F7F8",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    minHeight: 62,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorRowSelected: {
    backgroundColor: "#F8F5E8",
  },
  selectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 24,
    alignItems: "center",
  },
  selectorRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 10,
  },
  pill: {
    backgroundColor: "#F0FAF6",
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    color: "#008753",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  selectRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  selectRingActive: {
    borderColor: "#22C55E",
  },
  selectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  selectDotActive: {
    backgroundColor: "#22C55E",
  },
  done: {
    color: "#008753",
    fontSize: 12,
    fontWeight: "600",
  },
  body: {
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#F7F7F8",
    borderRadius: 12,
    padding: 12,
  },
  uploadCard: {
    backgroundColor: "#FBFEFD",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#0F766E",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  uploadTitle: {
    fontSize: 13,
    color: "#0B0014",
  },
  uploadHint: {
    marginTop: 4,
    color: "#85808A",
    fontSize: 11,
  },
  fileCard: {
    borderWidth: 1,
    borderColor: "#F7F7F8",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  fileMeta: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F7F7F8",
  },
  fileName: {
    fontSize: 13,
  },
  fileSubtext: {
    marginTop: 4,
    color: "#85808A",
    fontSize: 11,
  },
  clearFile: {
    color: "#CB010B",
    fontSize: 12,
  },
});
