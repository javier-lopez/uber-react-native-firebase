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

var usernamePlaceholder      = "username@domain.tld";
var passwordPlaceholder      = "password";
var passwordAgainPlaceholder = "repeat password";
var submit                   = "Sign Up";
var cancel                   = "Cancel";

export default class RegisterPage extends Component {
    state = {
        email:         null,
        password:      null,
        passwordAgain: null,
        //used to display a progress indicator if waiting for a network response.
        loading:       false,
    }

    register() {
        //while waiting for the firebase server show the loading indicator.
        this.setState({ loading: true });

        if (!this.state.email && !this.state.password && !this.state.passwordAgain) {
            this.setState({ loading: false });
            alert('Please fill all the required fields.');
            return;
        }

        if (this.state.password === this.state.passwordAgain) {
            //make a call to firebase to create a new user.
            this.props.firebaseDAO.auth().createUserWithEmailAndPassword(
                this.state.email, this.state.password).then(() => {
                    //catch are methods that we call on the Promise returned from
                    //createUserWithEmailAndPassword
                    this.setState({
                        //clear out the fields when the user logs in and hide the progress indicator.
                        email:         null,
                        password:      null,
                        passwordAgain: null,
                        loading:       false
                    });

                    //redirect to the login page
                    this.props.navigator.push( {
                        id:   'RegisteredPageId',
                        name: 'RegisteredPage',
                    });
                }).catch((error) => {
                    //leave the fields filled when an error occurs and hide the progress indicator.
                    this.setState({ loading: false });
                    alert("Account creation failed: " + error.message );
                });
        } else {
            alert('Password doesn\'t match');
            this.setState({
                password:      null,
                passwordAgain: null,
                loading:       false
            });
        }
    }

    render() {
        if (!this.state.loading) {
            if (this.props.usernamePlaceholder)
                {usernamePlaceholder=this.props.usernamePlaceholder};
            if (this.props.passwordPlaceholder)
                {passwordPlaceholder=this.props.passwordPlaceholder};
            if (this.props.passwordAgainPlaceholder)
                {passwordPlaceholder=this.props.passwordAgainPlaceholder};
            if (this.props.submit)
                {submit=this.props.submit};
            if (this.props.cancel)
                {cancel=this.props.cancel};

            return (
                <View style={RegisterPageStyles.container}>
                    <View style={RegisterPageStyles.body}>
                    <View>
                        <Text style={RegisterPageStyles.title}>{this.props.title}</Text>
                        <View style={{margin:15}} />

                        <TextInput style={RegisterPageStyles.textInput}
                            placeholder={usernamePlaceholder}
                            onChangeText={(text) => this.setState({email: text})}
                            value={this.state.email} />
                        <TextInput style={RegisterPageStyles.textInput}
                            secureTextEntry={true}
                            placeholder={passwordPlaceholder}
                            onChangeText={(text) => this.setState({password: text})}
                            value={this.state.password} />
                        <TextInput style={RegisterPageStyles.textInput}
                            secureTextEntry={true}
                            placeholder={passwordAgainPlaceholder}
                            onChangeText={(text) => this.setState({passwordAgain: text})}
                            value={this.state.passwordAgain} />
                        <View style={{margin:7}} />

                        <TouchableHighlight style={RegisterPageStyles.primaryButton}
                            onPress={this.register.bind(this)}>
                            <Text style={RegisterPageStyles.primaryButtonText}>{submit}</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={RegisterPageStyles.transparentButton}
                            onPress={() => this.props.navigator.push(
                                {
                                    id:   'LoginPageId',
                                    name: 'LoginPage',
                                }
                        )}>
                            <Text style={RegisterPageStyles.transparentButtonText}>{cancel}</Text>
                        </TouchableHighlight>
                    </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={RegisterPageStyles.container}>
                    <View style={RegisterPageStyles.body}>
                        <ActivityIndicator size="large"/>
                    </View>
                </View>
            );
        }
    }
}

const RegisterPageStyles = StyleSheet.create({
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
