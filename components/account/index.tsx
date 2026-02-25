import { accnt } from "@/utils";
import { useBooleans } from "@/utils/hooks";
import { useRouter } from "expo-router";
import { LogoutCurve, ArrowRight2 } from "iconsax-react-native";
import { VERSION } from "lodash";
import { ScrollView, View, Pressable, Text, StyleSheet } from "react-native";
import LogOutModal from "../log-out";
import { AccountItem } from "./transaction";
import { SafeAreaView } from "react-native-safe-area-context";

export const Account = () => {
    const router = useRouter();
    const [isOpen, openModal, closeModal] = useBooleans();
  
    return (
        <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
        //   contentContainerStyle={styles.scroll}
        >
          <View style={styles.section}>
            {accnt.map((itm) => (
              <View key={itm.title}>
                <Text style={styles.sectionTitle}>{itm.title}</Text>
                {itm.content.map((item) => (
                  <Pressable
                    key={item.text}
                    onPress={() => {
                      if (item.routes === "chat") {
                        console.log("open chat");
                      } else if (item.routes) {
                        // router.push(`/(tabs)/(account)/${item.routes}`);
                      }
                    }}
                  >
                    <AccountItem icon={item.icon} text={item.text} />
                  </Pressable>
                ))}
              </View>
            ))}
  
            <Pressable style={styles.logoutRow} onPress={openModal}>
              <View style={styles.logoutLeft}>
                <LogoutCurve color="#CB010B" size={20} />
                <Text style={styles.logoutText}>Log out</Text>
              </View>
              <ArrowRight2 color="#6B7280" size={20} />
            </Pressable>
  
            <View style={styles.footer}>
              <Text style={styles.version}>Version {VERSION}</Text>
            </View>
          </View>
        </ScrollView>
  
        <LogOutModal closeModal={closeModal} isOpen={isOpen} />
        </View>
    );
  };
  
  const styles = StyleSheet.create({
    safe: {
    //   flex: 1,
    //   backgroundColor: "#fff",
    },
    // scroll: {
    //   paddingHorizontal: 16,
    //   paddingBottom: 140,
    // },
    section: {
      gap: 4,
    },
    sectionTitle: {
      fontWeight: "600",
      fontSize: 14,
      marginTop: 24,
      marginBottom: 4,
      color: "#111",
    },
    logoutRow: {
      paddingVertical: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: "#F7F7F8",
      marginTop: 8,
    },
    logoutLeft: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    logoutText: {
      color: "#CB010B",
      fontSize: 14,
    },
    footer: {
      marginTop: 24,
      alignItems: "center",
    },
    version: {
      fontSize: 13,
      color: "#6B7280",
    },
  });