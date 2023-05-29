import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, View, FlatList, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

import ApiKeyContext from '../ApiKeyContext';

const MarsScreen = () => {
    const [roverPhotos, setRoverPhotos] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const apiKey = useContext(ApiKeyContext);

    useEffect(() => {
        axios
            .get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${apiKey}`)
            .then(response => setRoverPhotos(response.data.photos))
            .catch(error => console.log(error));
    }, []);

    const handleNextImage = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % roverPhotos.length);
        flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
    };

    const handlePreviousImage = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + roverPhotos.length) % roverPhotos.length);
        flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
    };

    return (
        <View style={{ flex: 1 }}>
            {roverPhotos ? (
                <View>
                    <FlatList
                        ref={flatListRef}
                        data={roverPhotos}
                        horizontal
                        pagingEnabled
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.button, styles.itemOutput]}>Date: {item.earth_date}</Text>
                                <Text style={[styles.button, styles.itemOutput]}>Camera: {item.camera.full_name}</Text>
                                <Image source={{ uri: item.img_src }} style={{ width: 415, height: 400 }} />
                            </View>
                        )}
                        getItemLayout={(data, index) => ({ length: 415, offset: 415 * index, index })}
                        initialScrollIndex={currentIndex}
                        onScrollToIndexFailed={() => { }}
                    />
                    <TouchableOpacity style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handlePreviousImage} style={styles.button}>
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleNextImage} style={styles.button}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text>Загрузка фото с Марса...</Text>
            )}
        </View>
    );
}

export default MarsScreen;

const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    button: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
    itemOutput: {
      backgroundColor: '#808080',
      color: '#ffffff',
      padding: 10
    }
  });