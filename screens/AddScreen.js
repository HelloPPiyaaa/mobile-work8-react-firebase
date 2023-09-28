import * as React from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import global from "../App";

export default class AddScreen extends React.Component {
    state = {
        name: '',
        confirmed: "0",
        death: "0",
        lastdeath: "0",
    };
    save_press() {
        if (this.state.name.length == 0) {
            alert("Area Name cannot be empty.");
            return;
        }
        global.firebase
            .database()
            .ref('corona').push(
                {
                    name: this.state.name,
                    confirmed: parseInt(this.state.confirmed) | 0,
                    death: parseInt(this.state.death) | 0,
                    lastdeath: parseInt(this.state.lastdeath) | 0,
                }
            );
        this.props.navigation.navigate("Home");
    }
    cancel_press() {
        this.props.navigation.navigate("Home");
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TextInput
                    label='Area name'
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                />

                <TextInput
                    label='confirmed'
                    value={this.state.confirmed}
                    onChangeText={confirmed => this.setState({ confirmed })}
                />

                <TextInput
                    label='death'
                    value={this.state.death}
                    onChangeText={death => this.setState({ death })}
                />

                <TextInput
                    label='lastdeath'
                    value={this.state.lastdeath}
                    onChangeText={lastdeath => this.setState({ lastdeath })}
                />
                <View style={{ flexDirection: "row" }}>
                    <Button onPress={() => this.save_press()}>Save</Button>
                    <Button onPress={() => this.cancel_press()}>Cancel</Button>
                </View>
            </View>

        );

    }
}