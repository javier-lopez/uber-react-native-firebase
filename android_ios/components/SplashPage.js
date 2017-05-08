import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

const logo = require('../../assets/img/logo.png')

export default class SplashPage extends Component {
    componentWillMount() {
        var navigator = this.props.navigator;
        setTimeout(() => {
            navigator.replace({
                id: 'LoginPageId',
            });
        }, 3000);
    }

    render() {
        return (
            <View style={SplashPageStyles.container}>
                <Image source={logo}/>
                <Text style={SplashPageStyles.splash}>SplashPage</Text>
            </View>
        );
    }
}

const SplashPageStyles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    splash: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});
