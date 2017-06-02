import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView from 'react-native-maps';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

import Loading from '../components/Loading'

const uberIcon   = require('../../assets/img/uber.png')
const searchIcon = require('../../assets/img/search.png')

export default class PickUpLocationPage extends Component {
    state = {
        user:              null,
        passengerLocation: null,
        mapRegion:         null,
        ubers:             null,
        type:              'x',
        gpsAccuracy:       null,
    }
    watchID = null

    componentWillMount() {
        this.setState({user: this.props.firebaseDAO.auth().currentUser});

        this.watchID = navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5,
            }

            this.onRegionChange(region, position.coords.accuracy);

            if (!this.state.passengerLocation) {
                let coords = {
                    latitude:  region.latitude,
                    longitude: region.longitude,
                }

                this.onPassengerLocationChange(coords);
            };
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region, gpsAccuracy) {
        this.setState({
            mapRegion:   region,
            gpsAccuracy: gpsAccuracy || this.state.gpsAccuracy,
        });
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomNearbyPosition(coords) {
        return {
            latitude:  coords.latitude  + this.getRandomInt(-100,100)/10000,
            longitude: coords.longitude + this.getRandomInt(-100,100)/10000,
        }
    }

    generateRandomUbers(coords) {
        let ubers = {
            'pool' : [
                { id: 1,  type: 'pool',  name: 'Ana',       position: this.randomNearbyPosition(coords) },
                { id: 2,  type: 'pool',  name: 'John',      position: this.randomNearbyPosition(coords) },
                { id: 3,  type: 'pool',  name: 'Emely',     position: this.randomNearbyPosition(coords) },
                { id: 4,  type: 'pool',  name: 'Mike',      position: this.randomNearbyPosition(coords) },
                { id: 5,  type: 'pool',  name: 'Christene', position: this.randomNearbyPosition(coords) },
            ],
            'x' : [
                { id: 6,  type: 'x',     name: 'Alice',     position: this.randomNearbyPosition(coords) },
                { id: 7,  type: 'x',     name: 'Bob',       position: this.randomNearbyPosition(coords) },
                { id: 8,  type: 'x',     name: 'Leidi di',  position: this.randomNearbyPosition(coords) },
                { id: 9,  type: 'x',     name: 'Brayan',    position: this.randomNearbyPosition(coords) },
                { id: 10, type: 'x',     name: 'Nicol',     position: this.randomNearbyPosition(coords) },
            ],
            'black' : [
                { id: 11, type: 'black', name: 'Yimi',      position: this.randomNearbyPosition(coords) },
                { id: 12, type: 'black', name: 'Lou',       position: this.randomNearbyPosition(coords) },
                { id: 13, type: 'black', name: 'Yann',      position: this.randomNearbyPosition(coords) },
                { id: 14, type: 'black', name: 'Dominique', position: this.randomNearbyPosition(coords) },
                { id: 15, type: 'black', name: 'Tim',       position: this.randomNearbyPosition(coords) },
            ]
        };

        //console.log('this.state.type', this.state.type)
        //console.log('ubers[this.state.type]', ubers[this.state.type]);
        return ubers[this.state.type];
    }

    onPassengerLocationChange(coords) {
        this.setState({
            passengerLocation: coords,
            ubers:             this.generateRandomUbers(coords),
        });

        //console.log(this.state.passengerLocation);
        //console.log(this.state.ubers);
    }

    updateTypeCallback() {
        this.setState({ubers: this.generateRandomUbers(this.state.passengerLocation)});
    }

    updateRegionCallback() {
        let coords = {
            latitude:  this.state.mapRegion.latitude,
            longitude: this.state.mapRegion.longitude,
        }
        this.onPassengerLocationChange(coords);
    }

    submitPickupLocation() {
        this.writePassengerData(this.state.passengerLocation, this.state.ubers[this.getRandomInt(0,4)]);

        this.props.navigator.push( {
            id:   'DestinationLocationPageId',
            name: 'DestinationLocationPage',
            pickUpLocation: this.state.passengerLocation,
        });
    }

    writePassengerData(coords, uber) {
        const userDAO = this.props.firebaseDAO.database().ref('users/' + this.state.user.uid);

        userDAO.update({
            pickUpLocation: coords,
            uber:           uber,
        });
    }

    render() {
        //Too much magic!!!!
        const {user, passengerLocation, mapRegion, ubers, gpsAccuracy} = this.state;
        //console.log('render()');
        //console.log('user: '             , user);
        //console.log('passengerLocation: ', passengerLocation);
        //console.log('mapRegion: '        , mapRegion);
        //console.log('gpsAccuracy: '      , gpsAccuracy);
        //console.log('ubers: '            , ubers);

        if (user && passengerLocation && mapRegion && ubers) {
            return (
                <View style={styles.container}>
                    <MapView style={styles.map} region={mapRegion}
                             loadingEnabled={true} loadingIndicatorColor="#999999"
                             onRegionChange={this.onRegionChange.bind(this)}>
                        <MapView.Marker title={user.email} description={user.uid} draggable coordinate={passengerLocation}
                            onDragEnd = {(e) => {this.onPassengerLocationChange(e.nativeEvent.coordinate)}}/>

                        {ubers.map((uber, index) =>
                            <MapView.Marker title={uber.name} description={uber.type} image={uberIcon}
                            style={styles.uber} coordinate={uber.position} key={uber.id}/>
                        )}
                    </MapView>

                    <View style={styles.searchContainer}>
                        <GooglePlacesAutocomplete
                            styles={searchBarStyles}
                            placeholder='Choose Your Location'
                            minLength={3} autoFocus={false}
                            fetchDetails={true}
                            enablePoweredByContainer={false}
                            currentLocation={false}
                            renderLeftButton={() => <Image style={searchBarStyles.searchIcon} source={searchIcon}/>}
                            //currentLocation={true}
                            //currentLocationLabel='Current Location'

                            onPress={(data, details = null) => {
                                //'details' is initialized on fetchDetails = true
                                let newRegion = {
                                    latitude:       details.geometry.location.lat,
                                    longitude:      details.geometry.location.lng,
                                    latitudeDelta:  this.state.mapRegion.latitudeDelta,
                                    longitudeDelta: this.state.mapRegion.longitudeDelta,
                                }

                                //investigate why it's required to use a callback function
                                //to force a re-render()
                                this.setState({mapRegion: newRegion}, this.updateRegionCallback);

                                //console.log('details', details);
                                //console.log('lat', details.geometry.location.lat);
                                //console.log('lng', details.geometry.location.lng);
                            }}
                            query={{
                              key:      'AIzaSyDF_xPY72A9X_dy13ud06Lg6Die6BJ_98M',
                              language: 'es',
                              types:    'geocode', }}
                        />
                    </View>

                    <View style={styles.typeUberContainer}>
                        <TouchableOpacity
                            style={[styles.button, this.state.type === 'pool' && styles.buttonActive]}
                            onPress={() => { this.setState({type: 'pool'}, this.updateTypeCallback); }}>
                            <Text style={[this.state.type === 'pool' && styles.textActive ]}>Uber Pool</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, this.state.type === 'x' && styles.buttonActive]}
                            onPress={() => { this.setState({type: 'x'}, this.updateTypeCallback); }}>
                            <Text style={[this.state.type === 'x' && styles.textActive ]}>Uber X</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, this.state.type === 'black' && styles.buttonActive]}
                            onPress={() => { this.setState({type: 'black'}, this.updateTypeCallback); }}>
                            <Text style={[this.state.type === 'black' && styles.textActive ]}>Uber Black</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.submitContainer}>
                        <TouchableOpacity onPress={this.submitPickupLocation.bind(this)}>
                            <Text style={styles.submitButton} >{'Set PickUp Location'.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <Loading text='Redirecting ...' />
           );
        }
  }
}

const styles = StyleSheet.create({
    container: {
        flex:            1,
        justifyContent:  'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    uber: {
        flex:   1,
        width:  20,
        height: 20,
    },
    searchContainer: {
        flex: 1,
    },
    typeUberContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    submitContainer: {
        //flexDirection: 'row',
        //justifyContent: 'center',
    },
    button: {
        alignItems:      'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius:    10,
        padding:         10,
        margin:          10,
    },
    buttonActive: {
        backgroundColor: 'black',
    },
    textActive: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: 'black',
        color:           'white',
        padding:         10,
        marginTop:       2,
        textAlign:       'center',
        fontSize:        16
    },
});

const searchBarStyles = StyleSheet.create({
    //textInputContainer  : {
        //backgroundColor : 'rgba(0,0,0,0)',
    //},

    //loader : {
        //backgroundColor : "#999999"
    //},

    //TODO >> find out a smarter way to make room for the search icon
    searchIcon: {
      margin:      13,
      marginLeft:   8,
      marginRight:  0,
    },
});
