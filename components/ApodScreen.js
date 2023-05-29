import React, { useEffect, useState, useContext } from 'react';
import { Text, View, Image } from 'react-native';
import axios from 'axios';

import ApiKeyContext from '../ApiKeyContext';

const ApodScreen = () => {
    const apiKey = useContext(ApiKeyContext);
    const [apodData, setApodData] = useState(null);

    useEffect(() => {
        axios
            .get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
            .then((response) => setApodData(response.data))
            .catch((error) => console.log(error));
    }, [apiKey]);

    return (
        <View style={{ flex: 1 }}>
            {apodData?.media_type === 'image' ? (
                <Image source={{ uri: apodData?.url }} style={{ width: 415, height: 400 }} />
            ) : (
                <Text style={{ margin: 10 }}>Извините, такой формат не поддерживается, пока что!{console.log(apiKey)}</Text>
            )}
            <Text style={{ margin: 10 }}>{apodData?.title}</Text>
            <Text style={{ margin: 10 }}>{apodData?.explanation}</Text>
        </View>
    );
};

export default ApodScreen;