import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useContext } from 'react';
import { Text, View, FlatList, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

import ApiKeyContext from '../ApiKeyContext';

const AsteroidsScreen = () => {
    const apiKey = useContext(ApiKeyContext);
    const [asteroidsData, setAsteroidsData] = useState(null);

    useEffect(() => {
        axios
            .get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=${apiKey}&count=100`)
            .then(response => setAsteroidsData(response.data.near_earth_objects))
            .catch(error => console.log(error));
    }, [apiKey]);

    const renderAsteroidItem = ({ item }) => {
        const asteroidId = item[0].id;
        const nasaJplUrl = item[0].nasa_jpl_url;

        const getAsteroidImageUrl = () => {
            const searchUrl = `https://images-api.nasa.gov/search?q=${asteroidId}`;
            return axios.get(searchUrl)
                .then(response => {
                    const items = response.data.collection.items;
                    if (items.length > 0 && items[0].links && items[0].links.length > 0) {
                        return items[0].links[0].href;
                    }
                    return null;
                })
                .catch(error => {
                    console.log(error);
                    return null;
                });
        };

        return (
            <View>
                <Text>Name: {item[0].name}</Text>
                <Text>Distance: {item[0].close_approach_data[0].miss_distance.kilometers} km</Text>
                {nasaJplUrl && (
                    <Image source={{ uri: nasaJplUrl }} style={{ width: 200, height: 200 }} />
                )}
                {!nasaJplUrl && (
                    <View>
                        <Text>Loading asteroid image...</Text>
                        {getAsteroidImageUrl().then(imageUrl => {
                            if (imageUrl) {
                                return (
                                    <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
                                );
                            }
                            return <Text>Фото астероидов</Text>;
                        })}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {asteroidsData && Object.values(asteroidsData) ? (
                <FlatList
                    data={Object.values(asteroidsData)}
                    keyExtractor={item => item[0].id}
                    renderItem={renderAsteroidItem}
                />
            ) : (
                <Text>Загрузка астероидов...</Text>
            )}
        </View>
    );
}

export default AsteroidsScreen;