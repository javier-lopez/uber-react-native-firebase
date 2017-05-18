import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';

import SplashPage         from './pages/SplashPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import RegisteredPage     from './pages/RegisteredPage'
import PickUpLocationPage from './pages/PickUpLocationPage'

export default class UberFooBarReactNativeFirebase extends Component {
    renderScene(route, navigator) {
        switch(route.id) {
            case 'SplashPageId':
                return (
                    <SplashPage title="Uber App" navigator={navigator}/>
                );

            case 'LoginPageId':
                return (
                    <LoginPage title="Welcome!" navigator={navigator}
                    />
                );

            case 'RegisterPageId':
                return (
                    <RegisterPage title="New user" navigator={navigator} />
                );

            case 'RegisteredPageId':
                return (
                    <RegisteredPage title="Sign up completed!" navigator={navigator} />
                );

            case 'PickUpLocationPageId':
                return (
                    <PickUpLocationPage navigator={navigator} />
                );

            default:
                return (
                    <SplashPage title="Uber App" navigator={navigator} />
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
