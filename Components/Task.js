import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';

export default class FocusTask extends React.Component {
  deleteIcon = (<Icon name="trash-o" size={12} color="white" />);

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
      <View style={styles.taskContainer}>
        <CheckBox
          isChecked={this.state.isSelected}
          onClick={this.setCheckboxSelection}
          style={styles.checkbox}
        />
        <TouchableOpacity onPress={this.props.onPress}>
          <Text numberOfLines={1} style={styles.item}>
            {' '}
            {this.props.taskName}{' '}
          </Text>
        </TouchableOpacity>
        <View style={{ paddingLeft: 10 }}>
          <Button
            buttonStyle={{ backgroundColor: 'red' }}
            icon={this.deleteIcon}
            title=""
            onPress={this.props.onDel}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkbox: {
    alignSelf: 'center',
  },
  item: {
    padding: 10,
    fontSize: 16,
    height: 44,
    flexWrap: 'wrap',
  },
});
