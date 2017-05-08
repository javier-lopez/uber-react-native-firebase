import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';

import SplashPage         from './components/SplashPage'
import LoginPage          from './components/LoginPage'
import PickUpLocationPage from './components/PickUpLocationPage'

export default class UberFooBarReactNativeFirebase extends Component {
    renderScene(route, navigator) {
        switch(route.id) {
            case 'SplashPageId':
                return (
                    <SplashPage navigator={navigator} />
                );

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
