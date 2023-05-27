import React, { useEffect, useState, useRef } from 'react';
import { Text, View, FlatList, Image, Button, TouchableOpacity, StyleSheet  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';

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
        <Text style={{ margin: 10 }}>Пошёл нахуй!</Text>
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
      return (
        <View>
          <Text>Name: {item.name}</Text>
          <Text>Distance: {item.close_approach_data[0].miss_distance.kilometers} km</Text>
          <Image source={{ uri: item.nasa_jpl_url }} style={{ width: 200, height: 200 }} />
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

function EarthScreen() {
  const [earthData, setEarthData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.nasa.gov/EPIC/api/earth/images?api_key=${API_KEY}`)
      .then(response => setEarthData(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {earthData ? (
        <FlatList
          data={earthData}
          keyExtractor={item => item.identifier.toString()}
          renderItem={({ item }) => (
            <View>
              <Image
                source={{ uri: `https://api.nasa.gov/EPIC/archive/natural/${item.image}.png?api_key=${API_KEY}` }}
                style={{ width: 415, height: 400 }}
              />
              <Text>Date: {item.date}</Text>
              <Text>Caption: {item.caption}</Text>
            </View>
          )}
        />
      ) : (
        <Text>Loading Earth data...</Text>
      )}
    </View>
  );
}

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
  const [epicImages, setEpicImages] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.nasa.gov/EPIC/api/natural/all?api_key=${API_KEY}`)
      .then(response => setEpicImages(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {epicImages && epicImages.length > 0 ? (
        <FlatList
          data={epicImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>Date: {item.date}</Text>
              <Text>Caption: {item.caption}</Text>
              <Image
                source={{ uri: `https://api.nasa.gov/EPIC/archive/natural/${item.image}.png?api_key=${API_KEY}` }}
                style={{ width: 415, height: 400 }}
              />
            </View>
          )}
        />
      ) : (
        <Text>Loading EPIC images...</Text>
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