import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
import itemsConfig from '../assets/data/known_items.json';

interface Item {
  key: string;
  title: string;
  thumbnail: string;
}

// Image map that dynamically includes the .png extension
const imageMap: { [key: string]: any } = {
  "gloves.png": require('../assets/thumbnails/gloves.png'),
  "sandals.png": require('../assets/thumbnails/sandals.png'),
  "socks.png": require('../assets/thumbnails/socks.png'),
};

export default function Index() {
  const { colors } = useTheme();
  const [data, setData] = useState<Item[]>([]);
  const [text, setText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Reference to the TextInput
  const textInputRef = useRef<TextInput>(null);

  // Listen for keyboard events to detect if the keyboard is open
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const addItem = () => {
    const normalizedInput = text.trim().toLowerCase();
    if (itemsConfig[normalizedInput]) {
      const item = itemsConfig[normalizedInput];
      setData([...data, { key: `${Date.now()}`, title: item.title, thumbnail: item.thumbnail }]);
      setText(''); // Clear the text input after adding the item
    }
  };

  const removeItem = (key: string) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => removeItem(item.key)}>
      <View style={styles.item}>
        <Image source={imageMap[item.thumbnail]} style={styles.thumbnail} />
        <Text style={[styles.text, { color: colors.text }]}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust the offset as needed
        >
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            numColumns={3} // Adjust the number of columns to control the grid layout
            contentContainerStyle={styles.grid}
            style={styles.list} // Ensure the list takes up available space
          />
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              style={[styles.input, { color: colors.text, borderColor: colors.text }]}
              placeholder="Type a new item"
              value={text}
              onChangeText={setText}
              onSubmitEditing={addItem} // Adds item when "Done" is pressed on the keyboard
              returnKeyType="done"
              blurOnSubmit={false} // Prevent the input from losing focus
            />
          </View>
        </KeyboardAvoidingView>
      {/* </TouchableWithoutFeedback> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensure input field stays at the bottom
  },
  list: {
    flex: 1, // Make the list take up the remaining space
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  item: {
    flex: 1,
    margin: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#000000', // Ensure it stands out from the background
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
