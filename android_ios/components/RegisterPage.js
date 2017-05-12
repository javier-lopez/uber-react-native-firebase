import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableHighlight,
    ActivityIndicator,
} from 'react-native';

export default class Login extends Component {
    state = {
        email:    null,
        password: null,
        loading: false,
    }

    render() {
        if (!this.state.loading) {
            return (
                <View style={RegisterPageStyles.container}>
                    <View style={RegisterPageStyles.body}>
                    <View>
                        <Text style={RegisterPageStyles.title}>RegisterPage</Text>
                        <View style={{margin:15}} />
                        <TextInput style={RegisterPageStyles.textInput} placeholder='Username'/>
                        <TextInput style={RegisterPageStyles.textInput} secureTextEntry={true} placeholder='Password' />
                        <TextInput style={RegisterPageStyles.textInput} secureTextEntry={true} placeholder='Repeat Password' />
                        <View style={{margin:7}} />
                        <TouchableHighlight style={RegisterPageStyles.primaryButton} onPress={() => this.props.navigator.push(
                                    {
                                        id:   'RegisteredPageId',
                                        name: 'RegisteredPage',
                                    }
                                )}>
                            <Text style={RegisterPageStyles.primaryButtonText}>Sign Up</Text>
                        </TouchableHighlight>
                    </View>
                    </View>
                </View>
            );
        } else {
            return <ActivityIndicator size="large"/>
        }

    }
}

const RegisterPageStyles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flex: 1
    },
    body: {
        flex: 9,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        margin: 5,
    },
    textInput: {
        height: 40,
        width: 250,
        borderWidth: 1
    },
    transparentButton: {
        marginTop: 5,
        padding:  15,
    },
    transparentButtonText: {
        color: '#0485A9',
        textAlign: 'center',
        fontSize: 16
    },
    primaryButton: {
        marginTop: 10,
        padding:   10,
        backgroundColor: 'black',
    },
    primaryButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 18
    },
    image: {
        width:  100,
        height: 100
    },
});
