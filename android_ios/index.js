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
        gpsAccuracy: null
    }
    watchID = null

    componentWillMount() {
        this.watchID = navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            }

            this.onRegionChange(region, position.coords.accuracy);
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

  render() {
      const { mapRegion, gpsAccuracy } = this.state;
      if (mapRegion) {
          return (
              <View style={styles.container}>
                <MapView style={styles.map} initialRegion={mapRegion} onRegionChange={this.onRegionChange.bind(this)} />
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
