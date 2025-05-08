import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

interface Props {
  titulo1: string;
  paginas1: React.ReactNode[];
  titulo2: string;
  paginas2: React.ReactNode[];
  corTexto: string;
  corCard: string;
}

const larguraTotal = Dimensions.get('window').width;
const larguraCard = (larguraTotal - 52) / 2;

export default function CardDuploCarrossel({
  titulo1,
  paginas1,
  titulo2,
  paginas2,
  corTexto,
  corCard,
}: Props) {
  const [paginaAtual1, setPaginaAtual1] = useState(0);
  const [paginaAtual2, setPaginaAtual2] = useState(0);
  const refScroll1 = useRef<ScrollView>(null);
  const refScroll2 = useRef<ScrollView>(null);

  const handleScroll1 = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const posX = e.nativeEvent.contentOffset.x;
    const pagina = Math.round(posX / larguraCard);
    setPaginaAtual1(pagina);
  };

  const handleScroll2 = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const posX = e.nativeEvent.contentOffset.x;
    const pagina = Math.round(posX / larguraCard);
    setPaginaAtual2(pagina);
  };

  return (
    <View style={styles.linha}>
      {/* CARD 1 */}
      <View style={[styles.card, { backgroundColor: corCard }]}>
      {titulo1 !== '' && (
        <Text style={[styles.titulo, { color: corTexto }]}>{titulo1}</Text>
      )}

        <ScrollView
          ref={refScroll1}
          horizontal
          pagingEnabled
          snapToInterval={larguraCard}
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll1}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollInterno}
        >
          {paginas1.map((conteudo, index) => (
            <View key={index} style={[styles.slide, { width: larguraCard, height: larguraCard}]}>
              {conteudo}
            </View>
          ))}
        </ScrollView>
        
      </View>

      {/* CARD 2 */}
      <View style={[styles.card, { backgroundColor: corCard }]}>
        <Text style={[styles.titulo, { color: corTexto }]}>{titulo2}</Text>
        <ScrollView
          ref={refScroll2}
          horizontal
          pagingEnabled
          snapToInterval={larguraCard}
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll2}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollInterno}
        >
          {paginas2.map((conteudo, index) => (
            <View key={index} style={[styles.slide, { width: larguraCard }]}>
              {conteudo}
            </View>
          ))}
        </ScrollView>
        {/* Bolinhas abaixo do carrossel */}
        <View style={styles.indicadorContainer}>
          {paginas2.map((_, index) => (
            <View
              key={index}
              style={[
                styles.bolinha,
                { opacity: paginaAtual2 === index ? 1 : 0.3 },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    //backgroundColor: 'rgba(232, 232, 232, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 15,
    fontFamily: 'CeraPro-Black'
  },
  titulo: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    marginBottom: 8,
    fontFamily: 'CeraPro-Black'
  },
  scrollInterno: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    marginRight: 0,
    borderRadius: 10,
    //backgroundColor: 'rgba(232, 232, 232, 0.5)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicadorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  bolinha: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
});
