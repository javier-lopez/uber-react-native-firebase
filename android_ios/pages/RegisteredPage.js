import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

var title       = "Sign up completed!"
var description = "You can now login, redirecting ..."

export default class RegisteredPage extends Component {
    componentWillMount() {
        var navigator = this.props.navigator;
        setTimeout(() => {
            navigator.replace({
                id: 'LoginPageId',
            });
        }, 3000);
    }

    render() {
        if (this.props.title)       {title=this.props.title};
        if (this.props.description) {description=this.props.description};

        return (
            <View style={RegisteredPageStyles.container}>
                <View>
                    <Text style={RegisteredPageStyles.title}>{title}</Text>
                    <View style={{margin:15}} />
                    <Text style={RegisteredPageStyles.loading}>{description}</Text>
                </View>
            </View>
        );
    }
}

const RegisteredPageStyles = StyleSheet.create({
    container: {
        flex:           1,
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'center',
    },
    title: {
        fontSize:  25,
        textAlign: 'center',
        margin:    5,
    },
    loading: {
        fontSize:  15,
        textAlign: 'center',
        margin:    10,
    },
});
