import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import Screen from '../../components/Screen';
import colors from '../../config/colors';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import toolsApi from '../../api/tools';
import RemovedScreen from '../RemovedScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LanguageContext } from '../../language/languageContext';

//text language options

const serieNumberText = {
  en: 'Serial number',
  sv: 'Serie nummer',
  es: 'Número de serie',
};

const placeText = {
  en: 'Current place',
  sv: 'Nuvarande plats',
  es: 'Lugar actual',
};

const groupText = {
  en: 'Tool group',
  sv: 'Verktygs grupp',
  es: 'Grupo',
};

const statusText = {
  en: 'Status',
  sv: 'Status',
  es: 'Estado',
};

const statusInfoText = {
  en: {
    isAvailable: 'Available',
    notAvailable: 'In use',
    inReparation: 'In reparation',
  },
  sv: {
    isAvailable: 'Tillgängligt',
    notAvailable: 'I användning',
    inReparation: 'På reparation',
  },
  es: {
    isAvailable: 'Libre',
    notAvailable: 'En uso',
    inReparation: 'En reparación',
  },
};

const editButtonText = {
  en: 'Edit tool',
  sv: 'Redigera verktyg',
  es: 'Editar herramienta',
};

const deleteButtonText = {
  en: 'Delete tool',
  sv: 'Radera verktyg',
  es: 'Eliminar herramienta',
};

const statusButtonText = {
  en: 'Set as available',
  sv: 'Sätt som tillgängligt',
  es: 'Marcar como disponible',
};

const recoverButtonText = {
  en: 'Recover to storage',
  sv: 'Återhämta till förråd',
  es: 'Recuperar a almacenamiento',
};

//alert language text options

const errorAlertText = {
  en: 'Tool could not be deleted',
  sv: 'Det gick inte att radera verktyg',
  es: 'No se pudo borrar la herramienta',
};

const alertTitle = {
  en: 'Delete tool',
  sv: 'Radera verktyg',
  es: 'Eliminar herramienta',
};

const alertMessage = {
  en: 'will be deleted, are you sure that you want to continue?',
  sv: 'kommer att raderas, är du säker du vill forsätta?',
  es: 'sera eliminado, ¿estas seguro que quieres continuar?',
};

const alertButtonNoText = {
  en: 'No',
  sv: 'Nej',
  es: 'No',
};

const alertButtonDeleteText = {
  en: 'Delete',
  sv: 'Radera',
  es: 'Eliminar',
};

const recoverErrorText = {
  en: 'Tool could not be recovered',
  sv: 'Det gick inte att återhämta verktyg',
  es: 'No se pudo recuperar la herramienta',
};
const reparationErrorText = {
  en: 'Tool could not be sent to reparation.',
  sv: 'Det gick inte att skicka till reparation.',
  es: 'No se pudo enviar a reparación.',
};

const sendToReparation = {
  en: 'Send to reparation',
  sv: 'Skicka på reparation',
  es: 'Enviar a reparación',
};
export default function ToolDetailsScreen({ route, navigation }) {
  const { language, options, updateLanguage } = useContext(LanguageContext);

  const [tool, setTool] = useState(route.params);
  const [removedVisible, setRemovedVisible] = useState(false);

  const handleStatus = async (tool) => {
    const result = await toolsApi.updateStatus(tool);
    console.log(result.data);
    const updatedTool = await toolsApi.getToolById(tool);
    setTool(updatedTool.data);
  };

  const handleRecover = async (tool) => {
    const result = await toolsApi.recoverTool(tool);
    if (!result.ok) {
      alert(recoverErrorText[language]);
    }
    const updatedTool = await toolsApi.getToolById(tool);
    setTool(updatedTool.data);
  };

  const handleDelete = async (tool) => {
    setRemovedVisible(true);
    const result = await toolsApi.deleteTool(tool);

    if (!result.ok) alert(errorAlertText[language]);
  };

  const handleDeleteButtonPress = (tool) => {
    Alert.alert(
      `${alertTitle[language]}`,
      `${tool.name} ${alertMessage[language]}`,
      [
        { text: alertButtonNoText[language] },
        {
          text: alertButtonDeleteText[language],
          onPress: () => handleDelete(tool),
          style: 'destructive',
        },
      ]
    );
  };

  const handleSendToReparation = async (tool) => {
    const result = await toolsApi.sendToReparation(tool);
    console.log(result.data);
    const updatedTool = await toolsApi.getToolById(tool);
    setTool(updatedTool.data);
  };

  return (
    <Screen style={styles.screen}>
      <RemovedScreen
        visible={removedVisible}
        onDone={() => {
          setRemovedVisible(false);
          setTimeout(() => {
            navigation.navigate('ToolListScreen');
          }, 1000);
        }}
      />
      <View style={styles.container}>
        <View style={styles.heading}>
          <View style={{ marginRight: 10 }}>
            <MaterialCommunityIcons
              name="tools"
              size={30}
              color={colors.primaryOpacity}
            />
          </View>
          <AppText style={styles.title}>{tool.name}</AppText>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <MaterialCommunityIcons
          name="identifier"
          size={30}
          color={colors.primaryOpacity}
        />
        <AppText style={styles.label}>{serieNumberText[language]}</AppText>
        <AppText style={styles.info}>{tool.serieNumber}</AppText>
      </View>

      <View style={styles.infoContainer}>
        <MaterialCommunityIcons
          name="city"
          size={30}
          color={colors.primaryOpacity}
        />
        <AppText style={styles.label}>{placeText[language]}</AppText>
        <AppText style={styles.info}>
          {tool.project ? tool.project.name : 'i förråd'}
        </AppText>
      </View>
      {tool.toolGroup && (
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons
            name="select-group"
            size={30}
            color={colors.primaryOpacity}
          />
          <AppText style={styles.label}>{groupText[language]}</AppText>
          <AppText style={styles.info}>{tool.toolGroup.name}</AppText>
        </View>
      )}
      <View style={styles.infoContainer}>
        <MaterialCommunityIcons
          name="list-status"
          size={30}
          color={colors.primaryOpacity}
        />
        <AppText style={styles.label}>{statusText[language]}</AppText>
        <AppText
          style={{
            color: tool.available ? colors.green : colors.danger,
            fontWeight: 'bold',
            marginLeft: 10,
          }}
        >
          {tool.available
            ? statusInfoText[language]['isAvailable']
            : !tool.available && tool.reparation
            ? statusInfoText[language]['inReparation']
            : statusInfoText['notAvailable']}
        </AppText>
      </View>
      <View style={styles.buttonContainer}>
        {!tool.available ? (
          <AppButton
            title={statusButtonText[language]}
            color="green"
            onPress={() => handleStatus(tool)}
          />
        ) : null}
        {tool.project ? (
          <AppButton
            title={recoverButtonText[language]}
            color="green"
            onPress={() => handleRecover(tool)}
          />
        ) : null}
        <AppButton
          title={editButtonText[language]}
          onPress={() => {
            navigation.navigate('EditToolScreen', [tool]);
          }}
        />
        <AppButton
          title={deleteButtonText[language]}
          color="danger"
          onPress={() => handleDeleteButtonPress(tool)}
        />
        <AppButton
          title={sendToReparation[language]}
          color="yellow"
          onPress={() => handleSendToReparation(tool)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
    marginTop: 20,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.yellow,
    maxWidth: '100%',
  },
  label: {
    color: colors.primaryOpacity,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 21,
  },
  info: {
    color: colors.primaryOpacity,
    fontSize: 20,
    padding: 5,
    textTransform: 'capitalize',
    fontStyle: 'italic',
    marginLeft: 10,
  },
  screen: {
    backgroundColor: colors.white,
    flex: 1,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 25,
    fontWeight: '800',
    color: colors.primaryOpacity,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 10,
    borderStyle: 'solid',
    borderBottomColor: colors.light,
    borderBottomWidth: 1,
  },
});
