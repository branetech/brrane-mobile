import { ArrowRight2 } from "iconsax-react-native";
import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

type Accn = {
  icon: React.ReactNode;
  text: string;
  routes?: string;
};

export const AccountItem = ({ icon, text }: Accn) => {
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* LEFT */}
      <View style={styles.left}>
        <View>{icon}</View>
        <Text style={styles.text}>{text}</Text>
      </View>

      {/* RIGHT */}
      <View>
        {text === "Show balance" ? (
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: "#F3D6D6", true: "#D2F1E4" }}
            thumbColor={enabled ? "#013D25" : "#8B0000"}
          />
        ) : (
          <ArrowRight2 color="#013D25" size={20} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      paddingVertical: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: "#f7f7f8",
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    text: {
      fontSize: 14,
      fontWeight: "500",
    },
  });