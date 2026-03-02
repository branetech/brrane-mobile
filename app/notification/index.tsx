import Back from "@/components/Back";
import { EmptyState } from "@/components/empty-state";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { Notification as BellIcon } from "iconsax-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface INotification {
  id: string;
  title: string;
  body: string;
  date: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: INotification[] = [
  {
    id: "1",
    title: "Enjoy fast & seamless transactions with Brane",
    body: "Fund your wallet today to enjoy convenience and rewards from every transaction",
    date: "Jan 20, 2024",
    isRead: false,
  },
  {
    id: "2",
    title: "Enjoy fast & seamless transactions with Brane all day, everyday",
    body: "Fund your wallet today to enjoy convenience and rewards from every transaction",
    date: "Jan 20, 2024",
    isRead: true,
  },
  {
    id: "3",
    title: "Enjoy fast & seamless transactions with Brane",
    body: "Fund your wallet today to enjoy convenience and rewards from every transaction",
    date: "Jan 18, 2024",
    isRead: true,
  },
];

const HAS_NOTIFICATIONS = MOCK_NOTIFICATIONS.length > 0;

export default function NotificationScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [selected, setSelected] = useState<INotification | null>(null);

  if (selected) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: C.background }]}
      >
        <View style={styles.header}>
          <Back onPress={() => setSelected(null)} />
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            Notification
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.detailContent}>
          <ThemedText type="subtitle" style={{ color: C.text, lineHeight: 28 }}>
            {selected.title}
          </ThemedText>
          <ThemedText style={{ color: C.muted, lineHeight: 22, marginTop: 12 }}>
            {selected.body}
          </ThemedText>
          <ThemedText style={{ color: C.muted, fontSize: 12, marginTop: 16 }}>
            {selected.date}
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back />
        <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
          Notification
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {HAS_NOTIFICATIONS ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {MOCK_NOTIFICATIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => setSelected(item)}
              style={[
                styles.card,
                item.isRead
                  ? {
                      backgroundColor: C.background,
                      borderWidth: 1,
                      borderColor: "#D3EBE1",
                    }
                  : { backgroundColor: "#F7F3E8" },
              ]}
            >
              <ThemedText style={styles.cardDate}>{item.date}</ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={{ color: C.text, fontSize: 14, marginTop: 4 }}
                numberOfLines={2}
              >
                {item.title}
              </ThemedText>
              <ThemedText
                style={{
                  color: C.muted,
                  fontSize: 12,
                  lineHeight: 18,
                  marginTop: 4,
                }}
                numberOfLines={2}
              >
                {item.body}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyWrapper}>
          <EmptyState>
            <BellIcon variant="TwoTone" size={24} color="#013D25" />
            <View style={{ gap: 4, alignItems: "center" }}>
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: 14, color: C.text }}
              >
                No new notification
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 12,
                  color: C.muted,
                  textAlign: "center",
                  paddingHorizontal: 32,
                }}
              >
                When you get a notification it appears here for easy tracking
              </ThemedText>
            </View>
          </EmptyState>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
    paddingTop: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  cardDate: {
    fontSize: 11,
    color: "#85808A",
    fontWeight: "400",
  },
  detailContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    flex: 1,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
