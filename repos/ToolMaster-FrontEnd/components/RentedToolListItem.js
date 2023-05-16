import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import AppText from './AppText';
import colors from '../config/colors';

export default function RentedToolListItem({ tool, onPress }) {
  const { name, rentedTo, rentStart } = tool;

  //converting the date string to a date object so its possible to display locale date string
  const startDate = new Date(rentStart);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.card}>
          <AppText style={styles.toolName}>{name}</AppText>
          <AppText style={styles.info}>Uthyrnings företag : {rentedTo}</AppText>
          <AppText style={styles.info}>
            Inhyrd frân den: {startDate.toLocaleDateString()}
          </AppText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  card: {
    backgroundColor: colors.primaryOpacity,
    width: '100%',
    padding: 20,
    borderRadius: 15,
    elevation: 8,
    shadowOffset: { height: 10, width: 10 },
    shadowColor: colors.dark,
    shadowOpacity: 0.1,
  },
  toolName: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.light,
    textTransform: 'capitalize',
  },
  info: {
    textTransform: 'capitalize',
    color: colors.light,
    padding: 5,
  },
  status: {
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
});
