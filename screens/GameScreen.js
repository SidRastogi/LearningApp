import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import DefaultStyles from '../constants/default-styles';
import MainButton from '../components/MainButton';
import BodyText from '../components/BodyText';

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;
  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
};

const renderItem = (listLength, itemData) => (
  <View style={styles.listItem}>
    <BodyText>#{listLength - itemData.index}</BodyText>
    <BodyText>{itemData.item}</BodyText>
  </View>
);

const GameScreen = props => {
  const initGuess = generateRandomBetween(1, 100, props.userChoice);
  const [currentGuess, setCurrentGuess] = useState(initGuess);
  const [postGuess, setPostGuess] = useState([initGuess.toString()]);
  const [avilableDeviceWidth, setAvilableDeviceWidth] = useState(
    Dimensions.get('window').width,
  );
  const [avilableDeviceHeight, setAvilableDeviceHeight] = useState(
    Dimensions.get('window').height,
  );
  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const {userChoice, onGameOver} = props;

  useEffect(() => {
    if (currentGuess === userChoice) {
      onGameOver(postGuess.length);
    }
  }, [currentGuess, userChoice, onGameOver]);

  useEffect(() => {
    const update = () => {
      setAvilableDeviceWidth(Dimensions.get('window').width);
      setAvilableDeviceHeight(Dimensions.get('window').height);
    };
    Dimensions.addEventListener('change', update);
    return () => {
      Dimensions.removeEventListener('change', update);
    };
  });

  const nextGuessHandler = direction => {
    if (
      (direction === 'lower' && currentGuess < props.userChoice) ||
      (direction === 'greater' && currentGuess > props.userChoice)
    ) {
      Alert.alert("Don't lie!", 'You know that this is wrong...', [
        {text: 'Sorry!', style: 'cancel'},
      ]);
      return;
    }
    if (direction === 'lower') {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }
    const nextNumber = generateRandomBetween(
      currentLow.current,
      currentHigh.current,
      currentGuess,
    );
    setCurrentGuess(nextNumber);
    setPostGuess(cureentGuess => [nextNumber.toString(), ...cureentGuess]);
  };

  let listContainerStyles = styles.listContainer;

  if (avilableDeviceWidth < 350) {
    listContainerStyles = styles.listContainerBig;
  }

  if (avilableDeviceHeight < 500) {
    return (
      <View style={styles.screen}>
        <Text style={DefaultStyles.title}>Opponent's Guess</Text>
        <View style={styles.control}>
          <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
            <Icon name="remove" size={20} />
          </MainButton>
          <NumberContainer>{currentGuess}</NumberContainer>
          <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
            <Icon name="add" size={20} />
          </MainButton>
        </View>
        <View style={listContainerStyles}>
          <FlatList
            data={postGuess}
            keyExtractor={item => item}
            renderItem={renderItem.bind(this, postGuess.length)}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={DefaultStyles.title}>Opponent's Guess</Text>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={{...styles.buttonContainer, marginTop: avilableDeviceHeight > 600 ? 20 : 5}}>
        <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
          <Icon name="remove" size={20} />
        </MainButton>
        <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
          <Icon name="add" size={20} />
        </MainButton>
      </Card>
      <View style={listContainerStyles}>
        <FlatList
          data={postGuess}
          keyExtractor={item => item}
          renderItem={renderItem.bind(this, postGuess.length)}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  control: {
    flex: 1,
    flexDirection: 'row',
    width: '60%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 400,
    maxWidth: '80%',
  },

  listContainer: {
    flex: 1,
    width: '60%',
  },
  listContainerBig: {
    flex: 1,
    width: '80%',
  },
  list: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  listItem: {
    borderColor: '#cccc',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default GameScreen;
