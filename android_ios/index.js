import React, { Component } from 'react';
import {
  Navigator,
  BackAndroid,
} from 'react-native';

import * as firebase from 'firebase';

import SplashPage              from './pages/SplashPage'
import LoginPage               from './pages/LoginPage'
import RegisterPage            from './pages/RegisterPage'
import RegisteredPage          from './pages/RegisteredPage'
import PickUpLocationPage      from './pages/PickUpLocationPage'
import DestinationLocationPage from './pages/DestinationLocationPage'
import ResultPage              from './pages/ResultPage'

const firebaseConfig = {
        apiKey:            "AIzaSyCbWYQPeyxGHNWqEajaPjOnCjshzN95sCo",
        authDomain:        "uber-react-native-firebase.firebaseDAO.com",
        databaseURL:       "https://uber-react-native-firebase.firebaseio.com",
        projectId:         "uber-react-native-firebase",
        storageBucket:     "uber-react-native-firebase.appspot.com",
        messagingSenderId: "176780898385"
};

const firebaseDAO = firebase.initializeApp(firebaseConfig);

export default class UberFooBarReactNativeFirebase extends Component {
    constructor(props) {
        super(props)
        this.navigator = null;

        //black magic
        this.handleBack = (() => {
            if (this.navigator && this.navigator.getCurrentRoutes().length > 1){
                this.navigator.pop();
                return true; //avoid closing the app
            }

            return false; //close the app
        }).bind(this) //don't forget bind this
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }

    renderScene(route, navigator) {
        switch(route.id) {
            case 'SplashPageId':
                return (
                    <SplashPage title="Uber App" navigator={navigator}/>
                );

            case 'LoginPageId':
                return (
                    <LoginPage title="Welcome!"
                        navigator={navigator}
                        firebaseDAO={firebaseDAO}
                    />
                );

            case 'RegisterPageId':
                return (
                    <RegisterPage title="New user"
                        navigator={navigator}
                        firebaseDAO={firebaseDAO}
                    />
                );

            case 'RegisteredPageId':
                return (
                    <RegisteredPage title="Sign up completed!" navigator={navigator} />
                );

            case 'PickUpLocationPageId':
                return (
                    <PickUpLocationPage
                        navigator={navigator}
                        firebaseDAO={firebaseDAO}
                    />
                );

            case 'DestinationLocationPageId':
                return (
                    <DestinationLocationPage
                        navigator={navigator}
                        firebaseDAO={firebaseDAO}
                        pickUpLocation={route.pickUpLocation}
                    />
                );

            case 'ResultPageId':
                return (
                    <ResultPage
                        navigator={navigator}
                        firebaseDAO={firebaseDAO}
                    />
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
                ref={navigator => {this.navigator = navigator}}
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
