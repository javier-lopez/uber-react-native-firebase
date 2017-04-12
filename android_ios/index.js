import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import MapView from 'react-native-maps';

var {height, width} = Dimensions.get('window');

export default class UberFooBarReactNativeFirebase extends Component {
    state = {
        mapRegion:   null,
        passengerLocation: null,
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

    onPassengerLocationChange(coords) {
        this.setState({
            passengerLocation: coords
        });
    }

  render() {
      const { passengerLocation, mapRegion, gpsAccuracy} = this.state;
      //console.log('mapRegion: '        , mapRegion);
      //console.log('passengerLocation: ', passengerLocation);
      //console.log('gpsAccuracy: '      , gpsAccuracy);

      if (mapRegion && passengerLocation) {
          return (
              <View style={styles.container}>
                <MapView style={styles.map} initialRegion={mapRegion}
                         onRegionChange={this.onRegionChange.bind(this)}>
                  <MapView.Marker draggable coordinate={passengerLocation}
                                  onDragEnd = {(e) => {this.onPassengerLocationChange(e.nativeEvent.coordinate)}}>
                  </MapView.Marker>
                </MapView>
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
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    height: height,
    width: width
  },
  loading: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
