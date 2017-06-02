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

var usernamePlaceholder = "username@domain.tld";
var passwordPlaceholder = "password";
var submit              = "Login";
var register            = "Register";

export default class LoginPage extends Component {
    state = {
        email:    null,
        password: null,
        loading:  false,
    }

    login(){
        //while waiting for the firebase server show the loading indicator.
        this.setState({ loading: true });

        if (this.state.email && this.state.password) {
            //log in and display an alert to tell the user what happened.
            this.props.firebaseDAO.auth().signInWithEmailAndPassword(
                this.state.email, this.state.password).then((userData) => {
                    this.setState({
                        //clear out the fields when the user logs in and hide the progress indicator.
                        email:         null,
                        password:      null,
                        loading:       false
                    });

                    //alert("Login successful, userData: " + JSON.stringify(userData, null, 4));

                    //redirect to the pickup page
                    this.props.navigator.push( {
                        id:   'PickUpLocationPageId',
                        name: 'PickUpLocationPage',
                    });
                }).catch((error) => {
                    //leave the fields filled when an error occurs and hide the progress indicator.
                    this.setState({ loading: false });
                    alert(error.message + " Please try again");
                });
        } else {
            alert('Please fill all the required fields.');
            this.setState({ loading: false });
        }
    }

    render() {
        if (!this.state.loading) {
            if (this.props.usernamePlaceholder)
                {usernamePlaceholder=this.props.usernamePlaceholder};
            if (this.props.passwordPlaceholder)
                {passwordPlaceholder=this.props.passwordPlaceholder};
            if (this.props.submit)
                {submit=this.props.submit};
            if (this.props.register)
                {register=this.props.register};

            return (
                <View style={LoginPageStyles.container}>
                    <View style={LoginPageStyles.body}>
                    <View>
                        <Text style={LoginPageStyles.title}>{this.props.title}</Text>
                        <View style={{margin:15}} />

                        <TextInput style={LoginPageStyles.textInput}
                            placeholder={usernamePlaceholder}
                            onChangeText={(text) => this.setState({email: text})}
                            value={this.state.email} />
                        <TextInput style={LoginPageStyles.textInput}
                            secureTextEntry={true}
                            placeholder={passwordPlaceholder}
                            onChangeText={(text) => this.setState({password: text})}
                            value={this.state.password} />
                        <View style={{margin:7}} />

                        <TouchableHighlight style={LoginPageStyles.primaryButton}
                            onPress={this.login.bind(this)}>
                            <Text style={LoginPageStyles.primaryButtonText}>{submit}</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={LoginPageStyles.transparentButton}
                            onPress={() => this.props.navigator.push(
                                {
                                    id:   'RegisterPageId',
                                    name: 'RegisterPage',
                                }
                        )}>
                            <Text style={LoginPageStyles.transparentButtonText}>{register}</Text>
                        </TouchableHighlight>
                    </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={LoginPageStyles.container}>
                    <View style={LoginPageStyles.body}>
                        <ActivityIndicator size="large"/>
                    </View>
                </View>
            );
        }
    }
}

const LoginPageStyles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flex:       1
    },
    body: {
        flex:            9,
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize:  25,
        textAlign: 'center',
        margin:    5,
    },
    textInput: {
        height:      40,
        width:       250,
        borderWidth: 1
    },
    transparentButton: {
        marginTop: 5,
        padding:   15,
    },
    transparentButtonText: {
        color:     '#0485A9',
        textAlign: 'center',
        fontSize:  16
    },
    primaryButton: {
        marginTop:       10,
        padding:         10,
        backgroundColor: 'black',
    },
    primaryButtonText: {
        color:     '#FFF',
        textAlign: 'center',
        fontSize:  18
    },
    image: {
        width:  100,
        height: 100
    },
});
