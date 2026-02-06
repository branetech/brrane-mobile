import { StyleSheet, View, Text } from 'react-native';

export default function HomeScreen() {
  return (
   <View style={styles.titleContainer}>
      <Text style={{color: '#fff'}}>Hello</Text>
   </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    padding: 19,
    gap: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
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
