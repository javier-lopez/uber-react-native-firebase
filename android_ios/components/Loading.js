import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

var text="Loading ..."

export default class Loading extends Component {
    render() {
        if (this.props.text) { text = this.props.text };

        return (
            <View style={LoadingStyles.container}>
                <Text style={LoadingStyles.loading}>{text}</Text>
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
