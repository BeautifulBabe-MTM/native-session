import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import axios from 'axios';

const NASA = ({ tabTitle }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/planetary/apod?api_key=4O7kxB74PxdUdOoK17f0pcqLZn4kJAmUDJrWYgbt`
        );

        setImageData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImageData();
  }, []);

  return (
    <View>
      {imageData ? (
        <Image source={{ uri: imageData.url }} style={{ width: 300, height: 300 }} />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default NASA;
