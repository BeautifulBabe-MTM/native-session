import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Text, View, FlatList, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import { decode as atob, encode as btoa } from 'base-64';

import ApiKeyContext from '../ApiKeyContext';

const EarthScreen = () => {
    const [earthImageUrl, setEarthImageUrl] = useState(null);
    const [date, setDate] = useState(null);
    const apiKey = useContext(ApiKeyContext);

    useEffect(() => {
        fetchEarthImage();
    }, []);

    const fetchEarthImage = () => {
        const apiUrl = `https://api.nasa.gov/planetary/earth/assets?lon=-95.33&lat=29.78&date=2018-01-01&&dim=0.10&api_key=${apiKey}`;
        axios
            .get(apiUrl)
            .then(response => {
                const { date, url } = response.data;
                setEarthImageUrl(url);
                setDate(date);
            })
            .catch(error => console.log(error));
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {earthImageUrl ? (
                <>
                    <Image source={{ uri: earthImageUrl }} style={{ width: 415, height: 400 }} />
                    <Text>Date: {date}</Text>
                </>
            ) : (
                <Text>Загрузка фото с Земли...</Text>
            )}
        </View>
    );
};


export default EarthScreen;