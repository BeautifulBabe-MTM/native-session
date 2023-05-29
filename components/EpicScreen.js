import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, View, FlatList, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { decode as atob, encode as btoa } from 'base-64';

import ApiKeyContext from '../ApiKeyContext';

function EpicScreen() {
    const [roverPhotos, setRoverPhotos] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const apiKey = useContext(ApiKeyContext);


    useEffect(() => {
        axios
            .get(`https://api.nasa.gov/EPIC/archive/natural/2019/05/30/png/epic_1b_20190530011359.png?api_key=${apiKey}`, {
                responseType: 'arraybuffer',
            })
            .then(response => {
                const base64Image = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setRoverPhotos([{ id: 1, base64Image }]);
            })
            .catch(error => console.log(error));
    }, []);

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
                                <Image source={{ uri: `data:image/png;base64,${item.base64Image}` }} style={{ width: 415, height: 400 }} />
                            </View>
                        )}
                        getItemLayout={(data, index) => ({ length: 415, offset: 415 * index, index })}
                        initialScrollIndex={currentIndex}
                        onScrollToIndexFailed={() => { }}
                    />
                </View>
            ) : (
                <Text>Загрузка фото с EPIC...</Text>
            )}
        </View>
    );
}

export default EpicScreen;