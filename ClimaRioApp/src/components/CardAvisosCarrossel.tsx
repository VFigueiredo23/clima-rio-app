import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
}

interface Props {
  avisos: Aviso[];
  corTexto: string;
  corCard: string;
  onPressAviso: (aviso: Aviso) => void;
}

const larguraTotal = Dimensions.get('window').width;
const larguraCard = larguraTotal - 32;

export default function CardAvisosCarrossel({ avisos, corTexto, corCard, onPressAviso }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: corCard }]}>
      <Text style={[styles.titulo, { color: corTexto }]}>📢 Avisos importantes</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={larguraCard}
        decelerationRate="fast"
      >
        {avisos.map((aviso) => (
          <TouchableOpacity
          key={aviso.id}
          style={[styles.avisoContainer, { width: larguraCard - 10, height: 180 }]}
          onPress={() => onPressAviso(aviso)}
          activeOpacity={0.9}
        >
          <Text style={[styles.tituloAviso, { color: corTexto }]} numberOfLines={2}>
            {aviso.titulo}
          </Text>
        
          <View style={{ flex: 1, position: 'relative' }}>
            <Text style={[styles.mensagem, { color: corTexto }]} numberOfLines={5}>
              {aviso.mensagem}
            </Text>
        
            <LinearGradient
              colors={['transparent', corCard]}
              style={styles.gradiente}
            >
              <Text style={[styles.verMais, { color: corTexto }]}>Ver mais ➡️</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    height: 250,
    overflow: 'hidden',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  avisoContainer: {
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tituloAviso: {
    fontSize: 20,
    fontWeight: '600',
  },
  mensagem: {
    fontSize: 16,
    marginTop: 4,
    padding: 10,
  },
  gradiente: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 5,
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  
  verMais: {
    fontSize: 14,
    textAlign: 'right',
  },
  
});
