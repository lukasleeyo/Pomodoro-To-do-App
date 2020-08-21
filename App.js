import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  CheckBox,
  Animated,
  FlatList,
  StatusBar,
  TextInput,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Task from './Components/Task';
import FocusTask from './Components/FocusTask';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import Timer from './Components/Timer';
import PlayButton from './Components/PlayButton';
import Icon from 'react-native-vector-icons/FontAwesome';
class DashboardScreen extends React.Component {
  constructor(props) {
    super(props);

    // {
    //   id: 0,
    //   title: 'Jogging',
    // },
    // {
    //   id: 1,
    //   title: 'Read about Milo',
    // },
    // {
    //   id: 2,
    //   title: 'Shopee games',
    // },
    // {
    //   id: 3,
    //   title: 'Daily Pokemon Go Tasks',
    // },
    // default tasks
    this.array = [];

    // state of the task list and text field
    // preload the task list array with default tasks
    this.state = {
      taskListHolder: this.array,
      textInput_Holder: '',
    };
  }
  // generate random ID for task https://gist.github.com/gordonbrander/2230317
  generateID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  // add new task to array and update the state of task array list and empty the text field
  joinData = async () => {
    // validate if task is entered, if not display error message
    if (this.state.textInput_Holder == '') {
      alert('Please fill in the task');
    } else {
      try {
        // before adding new task, grab from local storage first
        // then append new tasks to local storage array
        // https://stackoverflow.com/questions/50243950/how-to-receive-the-asyncstorage-items-in-flatlist?rq=1
        this.array = (await AsyncStorage.getItem('todos')) || '[]';
        this.array = JSON.parse(this.array);
        this.array.push({
          title: this.state.textInput_Holder,
          id: this.generateID(),
        }); // push new task to task array
        this.setState({
          taskListHolder: [...this.array],
          textInput_Holder: '',
        }); // set and update (aka refresh the flatlist upon updating) the state of the task list and empty the text field
        await AsyncStorage.setItem(
          'todos',
          JSON.stringify(this.state.taskListHolder)
        );
        //dismiss keyboard when added task.
        Keyboard.dismiss();
      } catch (error) {
        alert('Error saving');
      }
    }
  };

  // load data from phone storage
  loadTasks = async () => {
    try {
      const value = await AsyncStorage.getItem('todos');
      if (value !== null) {
        console.log('Old data loaded');
        this.setState({ taskListHolder: JSON.parse(value) });
      }
    } catch (error) {
      alert('Problem retrieving tasks.');
    }
  };

  // seperator to be used for the flatlist itemseperatorcomponent props to differentiate each task item on the flat list
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  // Delete function inspiration: https://stackoverflow.com/questions/58388642/remove-item-from-flatlist-in-react-native
  // actual delete task function and refresh the task list upon deleted.
  deleteTaskDetail = async (id) => {
    console.log('Deleting: ' + id);
    // before deleting a specific task, grab the entire array from local storage first
    // then delete that specific task from the local storage array
    // https://stackoverflow.com/questions/50243950/how-to-receive-the-asyncstorage-items-in-flatlist?rq=1
    this.array = (await AsyncStorage.getItem('todos')) || '[]';
    this.array = JSON.parse(this.array);
    this.array.splice(id, 1);
    this.setState({ taskListHolder: [...this.array], textInput_Holder: '' });
    // set the newly updated array to be our main array for flatlist
    try {
      await AsyncStorage.setItem(
        'todos',
        JSON.stringify(this.state.taskListHolder)
      );
    } catch (exception) {
      alert('Failed to delete the task!');
    }
  };
  // alert pop up to prompt delete task with cancel and ok option
  deleteTask(id) {
    Alert.alert(
      'Delete Task',
      'Are you sure want to delete this task?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed: ' + id),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.deleteTaskDetail(id) },
      ],
      { cancelable: false }
    );
  }

  // if list is empty, tell user to add new tasks now.
  ListEmpty = () => {
    return (
      //View to show when list is empty
      <View>
        <Text style={{ fontSize: 30, textAlign: 'center' }}>
          No Tasks found. Start being productive!
        </Text>
      </View>
    );
  };

  componentDidMount = () => {
    this.loadTasks();
  };

  render() {
    return (
      // https://www.freecodecamp.org/news/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580/
      <View style={styles.mainContainer}>
        <FlatList
          data={this.state.taskListHolder}
          width="100%"
          extraData={this.state.taskListHolder}
          keyExtractor={(index) => index.toString()}
          ListEmptyComponent={this.ListEmpty}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) => (
            <Task
              taskName={item.title}
              onPress={() =>
                this.props.navigation.navigate('Focus', {
                  taskName: item.title,
                })
              }
              onDel={() =>
                // https://stackoverflow.com/questions/34336633/remove-object-from-array-knowing-its-id
                this.deleteTask(
                  this.array
                    .map((x) => {
                      return x.id;
                    })
                    .indexOf(item.id)
                )
              }
            />
          )}
        />

        <TextInput
          placeholder="Enter your task here"
          onChangeText={(data) => this.setState({ textInput_Holder: data })}
          value={this.state.textInput_Holder}
          style={styles.textInputStyle}
          underlineColorAndroid="transparent"
        />

        <TouchableOpacity
          onPress={this.joinData}
          activeOpacity={0.7}
          style={styles.button}>
          <Text style={styles.buttonText}> Add Task</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class FocusScreen extends React.Component {
  constructor(props) {
    super(props);
    this.taskParam = JSON.parse(JSON.stringify(this.props.route.params));
  }
  // icon for start/pause button of timer
  startIcon = (<Icon name="play-circle" size={25} color="white" />);
  pauseIcon = (<Icon name="pause-circle" size={25} color="white" />);
  // state of the start/pause button of timer
  state = {
    icon: this.startIcon,
    shouldPlay: true, // when user clicks start button, it toggles the status, with a default true
    isPlaying: false, // by default, the timer won't play until user click start.
    minuteSeconds: 1500, // 25 minutes
    seconds: 0, // 0 seconds
    keyCounter: 0, //session 0 for timer by default
    keySecsCounter: 10, // session 10 for seconds timer by default, for some reason the id cannot be near and the same
    resetDisabled: true, //default reset buttton is disabled
  };

  // start timer and change icon accordingly
  startTimer = () => {
    this.setState({
      // toggle status with negation of status
      shouldPlay: !this.state.shouldPlay,
      isPlaying: !this.state.isPlaying,
      resetDisabled: !this.state.resetDisabled,
    });
    // if the timer should play, show pause icon because it will be playing the timer and will display pause button.
    // else when not playing will display the start button.
    if (this.state.shouldPlay == true) {
      this.setState({ icon: this.pauseIcon });
    } else {
      this.setState({ icon: this.startIcon });
    }
  };
  // reset timer, key props is keyCounter and keySecsCounter, weird props for this 3rd party component
  // basically i assume it means new session for timer each time it resets, hence i increment the counter by 1.
  resetTimer = () => {
    this.setState({
      isPlaying: false,
      keyCounter: this.state.keyCounter + 1,
      keySecsCounter: this.state.keySecsCounter + 1,
      shouldPlay: !this.state.shouldPlay,
      resetDisabled: !this.state.resetDisabled,
    });

    // if the timer should play, show pause icon because it will be playing the timer and will display pause button.
    // else when not playing will display the start button.
    if (this.state.shouldPlay == true) {
      this.setState({ icon: this.pauseIcon });
    } else {
      this.setState({ icon: this.startIcon });
    }
  };

  render() {
    return (
      <View style={styles.focusScreenStyle}>
        {/* DISPLAY TIMER COMPONENT */}
        <Timer
          isPlaying={this.state.isPlaying}
          minuteSeconds={this.state.minuteSeconds}
          seconds={this.state.seconds}
          keyCounter={this.state.keyCounter}
          keySecsCounter={this.state.keySecsCounter}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {/* DISPLAY Button to play/pause timer */}
          <PlayButton
            icon={this.state.icon}
            isPlaying={this.state.isPlaying}
            onPress={this.startTimer}
          />
          {/* DISPLAY Button to reset timer, disabled by default */}
          <Button
            disabled={this.state.resetDisabled}
            title="Reset"
            onPress={this.resetTimer}
          />
        </View>
        {/* DISPLAY TASK NAME */}
        <View>
          <FocusTask taskName={this.taskParam['taskName']} />
        </View>
      </View>
    );
  }
}
// ====== END OF SECTION FOCUS TASK ======

// ====== BEGIN OF SECTION STACK NAVIGATION ======
const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Focus" component={FocusScreen} />
    </Stack.Navigator>
  );
}

// ====== END OF SECTION STACK NAVIGATION ======
export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    );
  }
}

// ====== BEGIN SECTION OF STYLES ======
const styles = StyleSheet.create({
  focusScreenStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 2,
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    width: '90%',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 7,
    marginTop: 12,
  },

  button: {
    width: '90%',
    height: 40,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
// ====== END SECTION OF STYLES ======
