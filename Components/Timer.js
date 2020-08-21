import React, { Component } from 'react';
import { View, Text, StyleSheet, CheckBox } from 'react-native';
import Constants from 'expo-constants';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'; // https://www.npmjs.com/package/react-native-countdown-circle-timer
import PlayButton from './PlayButton';
export default class Timer extends React.Component {
  state = {
    minuteSeconds: 60,
    hourSeconds: 3600,
  };

  getTimeSeconds = (time) => (this.state.minuteSeconds - time / 1000) | 0;
  getTimeMinutes = (time) =>
    ((time % this.state.hourSeconds) / this.state.minuteSeconds) | 0;
  startTime = Date.now() / 1000;
  endTime = this.startTime + 243248; // use UNIX timestamp in seconds
  remainingTime = this.endTime - this.startTime;

  // RENDER TIMER WITH MINUTES AND SECONDS
  renderTime = (dimension, time) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.time}>{time}</Text>
        <Text>{dimension}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        {/* DISPLAYS CIRCULAR MINUTES TIMER */}
        <CountdownCircleTimer
          key={this.props.keyCounter} // IMPORTANT PROPS TO RESET THE TIMER
          size={120}
          strokeWidth={6}
          isPlaying={this.props.isPlaying} // IMPORTANT PROPS TO PLAY/PAUSE TIMER
          colors={[['#EF798A']]}
          duration={this.state.hourSeconds}
          initialRemainingTime={this.props.minuteSeconds}
          onComplete={(totalElapsedTime) => [
            this.remainingTime - totalElapsedTime > this.state.minuteSeconds,
          ]}>
          {({ elapsedTime }) =>
            this.renderTime(
              'minutes',
              this.getTimeMinutes(this.state.hourSeconds - elapsedTime / 1000)
            )
          }
        </CountdownCircleTimer>
        {/* DISPLAYS CIRCULAR SECONDS TIMER */}
        <CountdownCircleTimer
          key={this.props.keySecsCounter} // IMPORTANT PROPS TO RESET THE TIMER
          size={120}
          strokeWidth={6}
          isPlaying={this.props.isPlaying} // IMPORTANT PROPS TO PLAY/PAUSE TIMER
          colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}
          duration={this.state.minuteSeconds}
          initialRemainingTime={this.props.seconds}
          onComplete={(totalElapsedTime) => [
            this.remainingTime - totalElapsedTime > 0,
          ]}>
          {({ elapsedTime }) =>
            this.renderTime('seconds', this.getTimeSeconds(elapsedTime))
          }
        </CountdownCircleTimer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  time: {
    fontSize: 32,
  },
});
