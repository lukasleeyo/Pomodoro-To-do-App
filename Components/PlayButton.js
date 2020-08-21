import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class PlayButton extends React.Component {
  // startIcon = (<Icon name="play-circle" size={25} color="white" />);
  // pauseIcon = (<Icon name="pause-circle" size={25} color="white" />);

  // state of the icon and playing status
  // state = {
  //   icon: this.props.icon,
  //   shouldPlay: true,
  //   isPlaying: this.props.isPlaying,
  // };

  // start timer and change icon accordingly
  // startTimer = () => {
  //   this.setState({
  //     shouldPlay: !this.state.shouldPlay,
  //     isPlaying: !this.state.isPlaying,
  //   });
  //   if (this.state.shouldPlay == true) {
  //     this.setState({ icon: this.pauseIcon });
  //   } else {
  //     this.setState({ icon: this.startIcon });
  //   }
  // };

  render() {
    return (
      <View>
        <Button icon={this.props.icon} title="" onPress={this.props.onPress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
