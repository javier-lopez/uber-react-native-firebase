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

const searchIcon = require('../../assets/img/search.png')

export default class DestinationLocationPage extends Component {
    state = {
        user:                null,
        destinationLocation: null,
        mapRegion:           null,
    }

    componentWillMount() {
        this.setState({
            user: this.props.firebaseDAO.auth().currentUser,
            destinationLocation: this.props.pickUpLocation,
            mapRegion: {
                latitude:       this.props.pickUpLocation.latitude,
                longitude:      this.props.pickUpLocation.longitude,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5,
            },
        });
    }

    onRegionChange(region) {
        this.setState({
            mapRegion:   region,
        });
    }

    onDestinationLocationChange(coords) {
        this.setState({
            destinationLocation: coords,
        });
    }

    updateRegionCallback() {
        let coords = {
            latitude:  this.state.mapRegion.latitude,
            longitude: this.state.mapRegion.longitude,
        }
        this.onDestinationLocationChange(coords);
    }

    submitDestinationLocation() {
        this.writeDestinationLocation(this.state.destinationLocation);

        this.props.navigator.push( {
            id:   'ResultPageId',
            name: 'ResultPage',
        });
    }

    writeDestinationLocation(coords) {
        const userDAO = this.props.firebaseDAO.database().ref('users/' + this.state.user.uid);
        userDAO.update({destinationLocation: coords});
    }

    render() {
        //Too much magic!!!!
        const {user, destinationLocation, mapRegion} = this.state;
        //console.log('DestinationLocationPage render()');
        //console.log('user: ',                user);
        //console.log('destinationLocation: ', destinationLocation);
        //console.log('mapRegion: ',           mapRegion);

        if (user && destinationLocation && mapRegion) {
            return (
                <View style={styles.container}>
                    <MapView style={styles.map} region={mapRegion}
                             loadingEnabled={true} loadingIndicatorColor="#999999"
                             onRegionChange={this.onRegionChange.bind(this)}>
                        <MapView.Marker title={user.email} description={user.uid} draggable coordinate={destinationLocation}
                            onDragEnd = {(e) => {this.onDestinationLocationChange(e.nativeEvent.coordinate)}}/>
                    </MapView>

                    <View style={styles.searchContainer}>
                        <GooglePlacesAutocomplete
                            styles={searchBarStyles}
                            placeholder='Choose Your Destination'
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

                    <View style={styles.submitContainer}>
                        <TouchableOpacity onPress={this.submitDestinationLocation.bind(this)}>
                            <Text style={styles.submitButton} >{'Set Destination Location'.toUpperCase()}</Text>
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
        //TODO >> find out a smarter way to make room for the location search bar
        //marginTop: 42,
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
        flexDirection:  'row',
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
