import { BraneButton } from "@/components/brane-button";
import { GoldCurve, ModalGradientExact, PinCreated } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";

export const PinSuccessModal = ({
  visible,
  onContinue,
}: {
  visible: boolean;
  onContinue: () => void;
}) => {
    const scheme = useColorScheme();
    const C = Colors[scheme ?? "light"];
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={StyleSheet.absoluteFill}>
          <ModalGradientExact />
            <View style={styles.goldPosition}>
              <GoldCurve />
            </View>
          </View>

          <View style={styles.iconContainer}>
            <View >
              <PinCreated size={80} />
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <ThemedText type="subtitle" >
              Pin Created
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: C.muted, textAlign: "center", letterSpacing: 0 }}>
              You have successfully created your transaction PIN. Continue to perform your first transaction.
            </ThemedText>
          </View>

          <BraneButton
            text="Continue"
            onPress={onContinue}
            height={48}
            radius={12}
            backgroundColor="#013D25"
            textColor="#D2F1E4"
            style={{ width: 280 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  card: {
    width: 360,
    height: 320,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  goldPosition: {
    position: "absolute",
    right: 16,
    top: 40,
  },
  iconContainer: {
    marginTop: 32,
  },
});
