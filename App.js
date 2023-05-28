import React, { useEffect, useState, useRef } from 'react';
import { Text, View, FlatList, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import { decode as atob, encode as btoa } from 'base-64';

const API_KEY = '4O7kxB74PxdUdOoK17f0pcqLZn4kJAmUDJrWYgbt';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function ApodScreen() {
  const [apodData, setApodData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
      .then(response => setApodData(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {apodData?.media_type === 'image' ? (
        <Image source={{ uri: apodData?.url }} style={{ width: 415, height: 400 }} />
      ) : (
        <Text style={{ margin: 10 }}>Sorry, video format is not supported yet.</Text>
      )}
      <Text style={{ margin: 10 }}>{apodData?.title}</Text>
      <Text style={{ margin: 10 }}>{apodData?.explanation}</Text>
    </View>
  );
}

function AsteroidsScreen() {
  const [asteroidsData, setAsteroidsData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=${API_KEY}&count=100`)
      .then(response => setAsteroidsData(response.data.near_earth_objects))
      .catch(error => console.log(error));
  }, []);

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
              return <Text>No image available</Text>;
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
        <Text>Loading asteroids data...</Text>
      )}
    </View>
  );
}

const EarthScreen = () => {
  const [earthImageUrl, setEarthImageUrl] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    fetchEarthImage();
  }, []);

  const fetchEarthImage = () => {
    const apiUrl = `https://api.nasa.gov/planetary/earth/assets?lon=-95.33&lat=29.78&date=2018-01-01&&dim=0.10&api_key=${API_KEY}`;
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
        <Text>Loading Earth image...</Text>
      )}
    </View>
  );
};


function MarsScreen() {
  const [roverPhotos, setRoverPhotos] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    axios
      .get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_KEY}`)
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
        <Text>Loading Mars photos...</Text>
      )}
    </View>
  );
}

function EpicScreen() {
  const [roverPhotos, setRoverPhotos] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    axios
      .get(`https://api.nasa.gov/EPIC/archive/natural/2019/05/30/png/epic_1b_20190530011359.png?api_key=${API_KEY}`, {
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
        <Text>Ничего нет...</Text>
      )}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="APOD" component={ApodScreen} />
        <Tab.Screen name="Asteroids" component={AsteroidsScreen} />
        <Tab.Screen name="Earth" component={EarthScreen} />
        <Tab.Screen name="Mars" component={MarsScreen} />
        <Tab.Screen name="EPIC" component={EpicScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

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