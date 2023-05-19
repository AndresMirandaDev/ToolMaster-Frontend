import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import usersApi from '../../api/users';
import useApi from '../../hooks/useApi';
import Screen from '../../components/Screen';
import colors from '../../config/colors';
import AppForm from '../../components/forms/AppForm';
import AppFormPicker from '../../components/forms/AppFormPicker';
import SubmitButton from '../../components/SubmitButton';
import AppText from '../../components/AppText';
import salaryreportsApi from '../../api/salaryreports';
import AppButton from '../../components/AppButton';
import AppActivityIndicator from '../../components/AppActivityIndicator';

const months = {
  1: 'Januari',
  2: 'Februari',
  3: 'Mars',
  4: 'April',
  5: 'Maj',
  6: 'Juni',
  7: 'Juli',
  8: 'Augusti',
  9: 'September',
  10: 'Oktober',
  11: 'November',
  12: 'December',
};

export default function SearchSalaryReportScreen() {
  const { data: users, request: loadUsers } = useApi(usersApi.getAllUsers);
  const {
    data: reports,
    request: loadReports,
    loading,
  } = useApi(salaryreportsApi.getReports);
  const date = new Date();
  const [sentReports, setSentReports] = useState([]);

  const getSentSalaryReports = () => {
    salaryreportsApi.getReports().then((json) => {
      const sent = json.data.filter((r) => {
        return new Date(r.date).getMonth() === date.getMonth();
      });

      setSentReports(sent);
    });
  };

  useEffect(() => {
    loadUsers();
    getSentSalaryReports();
  }, []);

  return (
    <Screen style={styles.screen}>
      <View style={styles.formContainer}>
        <AppForm
          initialValues={{
            user: '',
          }}
        >
          <AppFormPicker
            items={users}
            icon="text-account"
            placeholder="Välj jobbare för att visa rapporter"
          />
          <SubmitButton title="visa rapporter" />
        </AppForm>
      </View>
      <View style={styles.info}>
        <AppActivityIndicator visible={loading} />
        <AppText style={styles.returnsNumber}>{sentReports.length}</AppText>
        <AppText style={styles.text}>
          Inckickade Rapporter i {months[date.getMonth() + 1]}
        </AppText>
        <View>
          <MaterialCommunityIcons
            name="file-check"
            size={50}
            color={colors.primaryOpacity}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    minHeight: '100%',
  },
  formContainer: {
    marginTop: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.light,
    marginTop: 30,
  },
  text: {
    color: colors.medium,
  },
  returnsNumber: {
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 50,
    marginRight: 10,
    color: colors.primaryOpacity,
  },
});
