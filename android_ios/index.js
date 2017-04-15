import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import MapView from 'react-native-maps';

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

//replaced by ...StyleSheet.absoluteFillObject
//var {height, width} = Dimensions.get('window');

const uberIcon   = require('../assets/img/uber.png')
const searchIcon = require('../assets/img/search.png')

export default class UberFooBarReactNativeFirebase extends Component {
    state = {
        mapRegion:   null,
        passengerLocation: null,
        ubers: null,
        gpsAccuracy: null
    }
    watchID = null

    //deltas aren't accurate, use hardcoded value in the meantime
    //getRegionFromCoordinates(latitude, longitude, accuracy) {
        //const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
        //const circumference = (40075 / 360) * 1000;

        //const deltaX = accuracy * (1 / (Math.cos(latitude) * circumference));
        //const deltaY= (accuracy / oneDegreeOfLongitudeInMeters);

        //return {
            //latitude:  latitude,
            //longitude: longitude,
            //latitudeDelta:  Math.max(0, deltaX),
            //longitudeDelta: Math.max(0, deltaY)
        //};
    //}

    componentWillMount() {
        this.watchID = navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            }

            //let region = this.getRegionFromCoordinates(
                    //position.coords.latitude,
                    //position.coords.longitude,
                    //position.coords.accuracy)

            let coords = {
                latitude:  region.latitude,
                longitude: region.longitude
            }

            this.onRegionChange(region, position.coords.accuracy);

            if (!this.state.passengerLocation) {
                this.onPassengerLocationChange(coords);
            };
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region, gpsAccuracy) {
        this.setState({
            mapRegion: region,
            gpsAccuracy: gpsAccuracy || this.state.gpsAccuracy
        });
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomNearbyPosition(coords) {
        return {
            latitude:  coords.latitude  + this.getRandomInt(-100,100)/10000,
            longitude: coords.longitude + this.getRandomInt(-100,100)/10000
        }
    }

    generateRandomUbers(coords) {
        return [
            { id: 1, name: 'Ana',       position: this.randomNearbyPosition(coords) },
            { id: 2, name: 'John',      position: this.randomNearbyPosition(coords) },
            { id: 3, name: 'Emely',     position: this.randomNearbyPosition(coords) },
            { id: 4, name: 'Mike',      position: this.randomNearbyPosition(coords) },
            { id: 5, name: 'Christene', position: this.randomNearbyPosition(coords) },
        ];
    }

    onPassengerLocationChange(coords) {
        this.setState({
            passengerLocation: coords
        });

        this.setState({
            ubers: this.generateRandomUbers(coords)
        });

        console.log(this.state.passengerLocation);
        console.log(this.state.ubers);
    }

  render() {
      const { passengerLocation, mapRegion, ubers, gpsAccuracy} = this.state;
      //console.log('mapRegion: '        , mapRegion);
      //console.log('passengerLocation: ', passengerLocation);
      //console.log('gpsAccuracy: '      , gpsAccuracy);
      //console.log('ubers: '            , ubers);

      if (mapRegion && passengerLocation && ubers) {
          return (
              <View style={styles.container}>

                <GooglePlacesAutocomplete style={styles.search}
                                          placeholder='Choose Your Location'
                                          minLength={3} autoFocus={false}
                                          fetchDetails={true}
                                          enablePoweredByContainer={false}
                                          currentLocation={false}
                                          renderLeftButton={() => <Image style={styles.searchIcon} source={searchIcon}/>}
                                          query={{
                                            key: 'AIzaSyDF_xPY72A9X_dy13ud06Lg6Die6BJ_98M',
                                            language: 'es',
                                            types: 'geocode', }} />

                <MapView style={styles.map} initialRegion={mapRegion}
                         onRegionChange={this.onRegionChange.bind(this)}>

                  <MapView.Marker draggable coordinate={passengerLocation}
                                  onDragEnd = {(e) => {this.onPassengerLocationChange(e.nativeEvent.coordinate)}}>
                  </MapView.Marker>

                  {ubers.map((uber, index) =>
                      <MapView.Marker title={uber.name} image={uberIcon}
                      style={styles.uber} coordinate={uber.position} key={uber.id}/>
                  )}

                </MapView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text>UberX</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                        <Text>Uber Black</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                        <Text>Uber VIP</Text>
                    </TouchableOpacity>
                </View>
              </View>
          );
      } else {
          return (
            <View style={styles.container}>
                <Text style={styles.loading}>Cargando ... </Text>
            </View>
         );
      }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    //TODO >> find out a smarter way to make room for the location search bar
    marginTop: 42,
  },
  loading: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  uber: {
    flex:   1,
    width:  20,
    height: 20,
  },
  //TODO >> find out a smarter way to make room for the search icon
  searchIcon: {
    margin:      13,
    marginLeft:   8,
    marginRight:  0,
  },
  search: {
    zIndex: 10, //move to front
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 10,
    margin:  10,
  },
});
