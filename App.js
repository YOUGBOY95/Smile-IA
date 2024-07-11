import React, { useState, useEffect, useRef } from 'react';
import {Platform,StatusBar,Text,View,TextInput,TouchableOpacity,StyleSheet,FlatList,AsyncStorage,SafeAreaView,KeyboardAvoidingView,Image,ScrollView,} from 'react-native';
import Message from './components/Message.jsx';
import botResponses from './DATA/messages.json';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('chatMessages');
        if (storedMessages) {
          setChatMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages depuis le stockage local :', error);
      }
    };

    loadMessages();
  }, []);

  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des messages dans le stockage local :', error);
    }
  };

  const getRandomResponse = () => {
    const responseKeys = Object.keys(botResponses.answers);
    const randomResponseId = responseKeys[Math.floor(Math.random() * responseKeys.length)];
    return botResponses.answers[randomResponseId];
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      const userMessage = {
        id: chatMessages.length + 1,
        sender: 'Moi',
        content: inputText,
      };

      const botResponse = {
        id: chatMessages.length + 2,
        sender: 'Capitaine-smile',
        content: getRandomResponse(),
      };

      const updatedMessages = [...chatMessages, userMessage, botResponse];
      setChatMessages(updatedMessages);
      saveMessages(updatedMessages); // Sauvegarder les messages dans le stockage local
      setInputText('');
    }
  };

  useEffect(() => {
    const thèmeSombreActif = true; //  logique de thème sombre/clair
    if (thèmeSombreActif) {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./components/cerveau.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>SMILE-IA</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -StatusBar.currentHeight}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }}
        >
          <FlatList
            data={chatMessages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Message data={item} />}
          />
        </ScrollView>
        
        <View style={styles.subContainer}>
          <TextInput
            style={[styles.input, { marginBottom: 15 }]}
            placeholder="Posez votre question..."
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />
          <TouchableOpacity style={[styles.sendButton, { marginBottom: 15 }]} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  appName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: 'black',
    color: 'white',
    borderColor: 'grey',
  },
    sendButton: {
    width: 40, // Largeur du bouton
    height: 40, // Hauteur du bouton
    backgroundColor: '#808fe3',
    borderRadius: 20, // La moitié de la largeur ou de la hauteur pour obtenir un cercle parfait
    justifyContent: 'center', // Centre le contenu à l'intérieur du bouton
    alignItems: 'center', // Centre le contenu à l'intérieur du bouton
    marginLeft: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});
