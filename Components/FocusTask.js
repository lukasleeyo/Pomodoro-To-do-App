import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from 'react-native-check-box';

export default class FocusTask extends React.Component {
  // state of the checkbox, default it's unchecked
  state = {
    isSelected: false,
  };

  // set the state of the checkbox when the checkbox is being checked/unchecked
  setCheckboxSelection = () => {
    this.setState({ isSelected: !this.state.isSelected });
  };

  render() {
    return (
      <View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            isChecked={this.state.isSelected}
            onClick={this.setCheckboxSelection}
            style={styles.checkbox}
          />
          <Text style={styles.label}>{this.props.taskName}</Text>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
    fontSize:20,
  },
});
