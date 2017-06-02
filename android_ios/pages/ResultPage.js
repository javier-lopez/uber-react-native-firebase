import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

export default class ResultPage extends Component {
    state = {
        user:                null,
        pickupLocation:      null,
        destinationLocation: null,
        uber:                null,
        loading:             true,
    }

    componentWillMount() {
        //while waiting for the firebase server show the loading indicator.
        const userDAO = this.props.firebaseDAO.database().ref('users/' + this.props.firebaseDAO.auth().currentUser.uid);

        //https://firebase.google.com/docs/database/web/read-and-write#read_data_once
        userDAO.once('value', (data) => {
            this.setState({
                user:                this.props.firebaseDAO.auth().currentUser,
                pickUpLocation:      data.val().pickUpLocation,
                destinationLocation: data.val().destinationLocation,
                uber:                data.val().uber,
                loading:             false,
            });
        });
    }

    render() {
        if (!this.state.loading) {
            return (
                <View style={style.container}>
                    <View style={style.body}>
                        <View>
                            <Text style={[style.title, style.underline]}>{this.state.user.email}</Text>
                            <View style={{margin:15}} />

                            <Text style={style.entry}>PickUp at: {JSON.stringify(this.state.pickUpLocation, null, 4)}</Text>
                            <Text style={style.entry}>Leave at: {JSON.stringify(this.state.destinationLocation, null, 4)}</Text>
                            <Text style={style.entry}>Uber: {JSON.stringify(this.state.uber, null, 4)}</Text>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={style.container}>
                    <View style={style.body}>
                        <ActivityIndicator size="large"/>
                    </View>
                </View>
            );
        }
    }
}

const style = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flex:       1
    },
    body: {
        flex:            9,
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize:  25,
        textAlign: 'center',
        margin:    5,
    },
    underline: {
        textDecorationLine: 'underline',
    },
    entry: {
        fontSize:  20,
        textAlign: 'center',
        margin:    5,
    },
});
