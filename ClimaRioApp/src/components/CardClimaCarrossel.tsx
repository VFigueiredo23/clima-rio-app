import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';

const largura = Dimensions.get('window').width * 0.88;

export default function CardClimaCarrossel({ clima, animacao, tema, ehNoite, bairroSelecionado, onTrocarBairro }) {
  const [pagina, setPagina] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const atual = Math.round(x / largura);
    setPagina(atual);
  };

  return (
    <View style={[styles.card, { backgroundColor: tema.card }]}>
      <ScrollView
        horizontal
        pagingEnabled
        snapToInterval={largura}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
      >
        {/* Página 1 – Clima atual */}
        <View style={[styles.slide]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: tema.texto }}>
              {bairroSelecionado}
            </Text>
            <TouchableOpacity onPress={onTrocarBairro}>
              <Text style={{ fontSize: 20, color: tema.texto }}>🔄</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.titulo, { color: tema.texto }]}>
            {clima.cidade}
          </Text>
          <Text style={[styles.temp, { color: tema.texto, textAlign: 'left' }]}>
            {isNaN(Number(clima.temperatura)) ? '—°C' : `${Number(clima.temperatura).toFixed(0)}°C`}
          </Text>
          <Text style={{ color: tema.texto }}>
            {clima.descricao}
          </Text>

          {animacao && (
            <LottieView
              source={animacao}
              autoPlay
              loop
              style={{ width: 120, height: 120, marginTop: 8 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Indicador de página */}
      <View style={styles.indicadorContainer}>
        {[0].map((i) => (
          <View
            key={i}
            style={[
              styles.bolinha,
              { opacity: pagina === i ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 18,
    marginTop: 36,
    backgroundColor: 'rgba(255,255,255,0)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    fontFamily: 'CeraPro-Black'
  },
  slide: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'CeraPro-Black'
  },
  temp: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 2,
    fontFamily: 'CeraPro-Medium'
  },
  indicadorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  bolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
});
