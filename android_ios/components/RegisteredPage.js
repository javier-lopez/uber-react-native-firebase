import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

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
            <View style={RegisteredPageStyles.container}>
                <View>
                    <Text style={RegisteredPageStyles.title}>Sign up completed!</Text>
                    <View style={{margin:15}} />
                    <Text style={RegisteredPageStyles.loading}>Now you can login, redirecting ...</Text>
                </View>
            </View>
        );
    }
}

const RegisteredPageStyles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        margin: 5,
    },
    loading: {
        fontSize: 15,
        textAlign: 'center',
        margin: 10,
    },
});
