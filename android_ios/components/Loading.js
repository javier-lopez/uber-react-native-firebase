import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default class Loading extends Component {
    render() {
        return (
            <View style={LoadingStyles.container}>
                <Text style={LoadingStyles.loading}>Cargando ... </Text>
            </View>
        );
    }
}

const LoadingStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    loading: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});
