import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async () => {
    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        body: JSON.stringify({
          q: inputText,
          source: 'auto',
          target: 'en',
          format: 'text'
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      Alert.alert('خطأ في الترجمة', error.message);
    }
  };

  const handleSave = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'translated.txt';
      await FileSystem.writeAsStringAsync(fileUri, translatedText);
      Alert.alert('تم الحفظ', 'تم حفظ الملف في: ' + fileUri);
    } catch (error) {
      Alert.alert('خطأ في الحفظ', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 مترجم الملفات</Text>
      <TextInput
        style={styles.input}
        placeholder="أدخل النص أو اختر ملفًا"
        multiline
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="ترجمة" onPress={handleTranslate} />
      <Text style={styles.result}>{translatedText}</Text>
      <Button title="💾 حفظ الملف" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, height: 100 },
  result: { marginVertical: 20, fontSize: 16 },
});
