import { ArrowRight2 } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

type Accn = {
  icon: React.ReactNode;
  text: string;
  routes?: string;
};

export const AccountItem = ({ icon, text }: Accn) => {
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={styles.text}>{text}</Text>
      </View>

      <View>
        {text === "Show balance" ? (
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: "#F3D6D6", true: "#D2F1E4" }}
            thumbColor={enabled ? "#013D25" : "#8B0000"}
          />
        ) : (
          <ArrowRight2 color="#85808A" size={16} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#F7F7F8",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D2F1E4",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0B0014",
  },
});
