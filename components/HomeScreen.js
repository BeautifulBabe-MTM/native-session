import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');

  const handleInputChange = (value) => {
    setApiKey(value);
  };

  const handleSaveApiKey = async () => {
    try {
      await AsyncStorage.setItem('API_KEY', apiKey);
      onApiKeySet(apiKey); // Callback to pass the API_KEY to the parent component
      console.log(`API ключ успешно сохранён - ${apiKey}`);
    } catch (error) {
      console.log('Ошибка при сохранении API ключа:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Аутентификация</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        placeholder="Введите ваш API ключ"
        value={apiKey}
        onChangeText={handleInputChange}
      />
      <Button title="Сохранить ваш API ключ" onPress={handleSaveApiKey} />
    </View>
  );
};

export default HomeScreen;