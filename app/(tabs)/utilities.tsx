import { ThemedText } from '@/components/themed-text';
import { View } from '@idimma/rn-widget';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UtiliScreen() {
  return (
   <SafeAreaView style={styles.container}>
      <ThemedText>Hello</ThemedText>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '12%',
    paddingVertical: '5%',
    gap: 20,
    position: 'relative',
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
