import React, { Component } from 'react';
import {
  Navigator,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

import LoginPage          from './components/LoginPage'
import PickUpLocationPage from './components/PickUpLocationPage'

export default class UberFooBarReactNativeFirebase extends Component {

    SplashPage(navigator) {
        const logo = require('../assets/img/logo.png')

        setTimeout(() => {
            navigator.replace({
                id: 'LoginPageId',
            });
        }, 3000);

        return (
            <View style={SplashPageStyles.container}>
                <Image source={logo}/>
                <Text style={SplashPageStyles.splash}>SplashPage</Text>
            </View>
        );
    }

    renderScene(route, navigator) {
        switch(route.id) {
            case 'SplashPageId':
                return this.SplashPage(navigator);

            case 'LoginPageId':
                return (
                    <LoginPage navigator={navigator} />
                );

            case 'PickUpLocationPageId':
                return (
                    <PickUpLocationPage />
                );

            default:
                return (
                    <SplashPage navigator={navigator} />
                );
        }
    }

    render() {
        return (
            <Navigator
                initialRoute={{id: 'SplashPageId', name: 'SplashPage'}}
                renderScene={this.renderScene.bind(this)}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    return Navigator.SceneConfigs.FloatFromRight;
                }} />
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
