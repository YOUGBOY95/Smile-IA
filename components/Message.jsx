import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Vibration } from 'react-native';

const Message = ({ data }) => {
  const isUser = data.sender === 'Moi';
  const [messageText, setMessageText] = useState('');
  const circleColor = isUser ? '#808fe3' : '#1a2541';
  const senderName = isUser ? 'Moi' : 'Capitaine-smile';

  useEffect(() => {
    if (!isUser && data.content) {
      const writeEffect = async () => {
        const normalizedText = data.content.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        for (let i = 0; i < normalizedText.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 30)); // Délai entre chaque lettre pour rajouter un effet typed
          setMessageText(prevText => prevText + normalizedText[i]);
        }
        // Vibration à la fin de l'effet d'écriture
        Vibration.vibrate(100); // 100ms de vibration, ajustez selon vos préférences
      };
      writeEffect();
    }
  }, [data]);

  return (
    <View style={styles.messageContainer}>
      <View style={[styles.circle, { backgroundColor: circleColor }]} />
      <View style={[styles.messageContentContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
        <Text style={styles.senderName}>{senderName}</Text>
        <Text style={styles.messageContent}>{isUser ? data.content : messageText}</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 2,
    marginTop: 8, 
  },
  messageContentContainer: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
 
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
   
  },
   senderName: {
    fontSize: 12,
    color: 'gray', 
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageContent: {
    color: 'white',
    fontSize: 16,
  },
});

export default Message;
