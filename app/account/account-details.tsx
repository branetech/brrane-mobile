import Back from "@/components/Back";
import { Avatar } from "@/components/avatar";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <View style={styles.row} row spaced aligned>
    <ThemedText style={styles.label}>{label}</ThemedText>
    <ThemedText style={styles.value}>{value || "-"}</ThemedText>
  </View>
);

export default function AccountDetailsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "User";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type="subtitle">Account details</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrap}>
          <Avatar name={fullName} src={user?.image} size={96} shape="circle" />
          <ThemedText style={styles.avatarHint}>Profile details</ThemedText>
        </View>

        <Row label="First Name" value={user?.firstName || undefined} />
        <Row label="Last Name" value={user?.lastName || undefined} />
        <Row label="Phone Number" value={user?.phone || undefined} />
        <Row label="Email Address" value={user?.email || undefined} />
        <Row
          label="Username"
          value={user?.username ? `@${user.username}` : undefined}
        />
        <Row label="Address" value={user?.houseAddress || undefined} />

        <View style={styles.note}>
          <ThemedText style={styles.noteText}>
            For account information concerns, please send an email to
            contact@getbrane.co for edits.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  avatarHint: {
    color: "#013D25",
    fontSize: 13,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F8",
    paddingVertical: 12,
  },
  label: {
    color: "#85808A",
    fontSize: 13,
  },
  value: {
    color: "#0B0014",
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
    textAlign: "right",
  },
  note: {
    marginTop: 16,
    backgroundColor: "#F0FAF6",
    borderRadius: 12,
    padding: 12,
  },
  noteText: {
    color: "#342A3B",
    fontSize: 12,
  },
});
