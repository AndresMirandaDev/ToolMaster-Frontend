import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import Screen from '../../components/Screen';
import AppForm from '../../components/forms/AppForm';
import AppText from '../../components/AppText';
import AppFormField from '../../components/forms/AppFormField';
import SubmitButton from '../../components/SubmitButton';
import AppFormPicker from '../../components/forms/AppFormPicker';
import colors from '../../config/colors';
import UploadScreen from '../UploadScreen';
import useApi from '../../hooks/useApi';
import toolGroupApi from '../../api/toolGroups';
import toolsApi from '../../api/tools';

//dummy data

// const tool = {
//   name: 'hilti 1500',
//   id: 1,
//   serieNumber: 12345,
//   toolGroup: { name: 'asbestsanering', description: 'some description' },
//   project: { name: 'spiralen', projectNumber: 12333 },
//   available: true,
// };

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  serieNumber: Yup.string(),
  toolGroup: Yup.object(),
});

// const toolGroups = [
//   { name: 'asbest sanering', id: 5 },
//   { name: 'bilmaskiner', id: 6 },
//   { name: 'håltagning', id: 7 },
//   { name: 'flexmaskiner', id: 8 },
// ];
//should take the tool from route params comming from the tool detalils screen in the edit button onpress function navigate implementation
export default function EditToolScreen({ route, navigation }) {
  const tool = route.params[0];
  const { data: toolGroups, request: loadToolGroups } = useApi(
    toolGroupApi.getToolGroups
  );
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadToolGroups();
  }, []);

  const handleSubmit = async (toolToUpdate) => {
    setProgress(0);
    setUploadVisible(true);
    const updatedTool = {
      _id: toolToUpdate._id,
      name: !toolToUpdate.name ? tool.name : toolToUpdate.name,
      serieNumber: !toolToUpdate.serieNumber
        ? tool.serieNumber
        : toolToUpdate.serieNumber,
      toolGroup: !toolToUpdate.toolGroup
        ? tool.toolGroup._id
        : toolToUpdate.toolGroup._id,
    };

    const result = await toolsApi.updateTool(updatedTool, (progress) => {
      setProgress(progress);
    });

    if (!result.ok) {
      setUploadVisible(false);
      alert('Verktyg kunde inte uppdateras');
    }
  };
  return (
    <Screen style={styles.screen}>
      <UploadScreen
        visible={uploadVisible}
        progress={progress}
        onDone={() => {
          setUploadVisible(false);
          setTimeout(() => {
            navigation.navigate('ToolsScreen');
          }, 1000);
        }}
      />
      <View style={styles.heading}>
        <AppText style={styles.info}>Regidera verktyg</AppText>
      </View>
      <View style={styles.formContainer}>
        <AppForm
          initialValues={{
            name: '',
            serieNumber: '',
            toolGroup: '',
            _id: tool._id,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <AppFormField name="name" icon="tools" placeholder={tool.name} />
          <AppFormField
            name="serieNumber"
            icon="identifier"
            placeholder={tool.serieNumber.toString()}
          />
          <AppFormPicker
            items={toolGroups}
            name="toolGroup"
            icon="select-group"
            placeholder={
              tool.toolGroup ? tool.toolGroup.name : 'Verktygs grupp'
            }
            width="60%"
          />
          <SubmitButton title="upppdatera verktyg" color="green" />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    minHeight: '100%',
  },
  info: {
    textAlign: 'center',
    padding: 10,
    textTransform: 'capitalize',
    color: colors.primaryOpacity,
    fontSize: 25,
  },
  heading: {
    backgroundColor: colors.yellow,
  },
  formContainer: {
    padding: 7,
  },
});
