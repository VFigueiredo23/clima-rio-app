// src/components/CardTransito.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const largura = Dimensions.get('window').width;

const CardTransito = ({ tempo, origem, destino, rota }) => {
  return (
    <View style={estilos.card}>
      <Text style={estilos.titulo}>🚗 Tempo estimado: {tempo}</Text>
      <MapView
        style={estilos.mapa}
        initialRegion={{
          latitude: origem.latitude,
          longitude: origem.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={origem} title="Origem" />
        <Marker coordinate={destino} title="Destino" />
        {rota && (
          <Polyline
            coordinates={rota}
            strokeColor="#42b9eb"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

const estilos = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginVertical: 12,
    width: largura - 40,
    alignSelf: 'center',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  mapa: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});

export default CardTransito;
