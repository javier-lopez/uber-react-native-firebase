import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import MapView from 'react-native-maps';

var {height, width} = Dimensions.get('window');

const uberIcon = require('../assets/img/uber.png')

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
  uber: {
    flex:   1,
    width:  20,
    height: 20
  }
});
