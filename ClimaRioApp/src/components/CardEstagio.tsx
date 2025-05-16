import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const altura = 60; // altura de cada "página" do card

interface Props {
  titulo: string;
  paginas: React.ReactNode[];
  corTexto: string;
  corCard: string;
}

const CardEstagio: React.FC<Props> = ({ titulo, paginas, corTexto, corCard }) => {
  const flatListRef = useRef<FlatList>(null);
  const [indexAtual, setIndexAtual] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const intervalo = setInterval(() => {
        const proximo = (indexAtual + 1) % paginas.length;
        setIndexAtual(proximo);
        flatListRef.current?.scrollToIndex({ index: proximo, animated: true });
      }, 8000);
      return () => clearInterval(intervalo);
    }, 500);

    return () => clearTimeout(timeout);
  }, [indexAtual, paginas.length]);

  return (
    <View style={[estilos.card, { backgroundColor: corCard }]}>
      <Text style={[estilos.titulo, { color: corTexto }]}>{titulo}</Text>
      <View style={{ height: altura }}>
        <FlatList
          ref={flatListRef}
          data={paginas}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <View style={estilos.pagina}>{item}</View>}
          horizontal={false}
          pagingEnabled={true}
          scrollEnabled={false}
          initialScrollIndex={0}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: altura,
            offset: altura * index,
            index,
          })}
        />
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pagina: {
    height: altura,
    justifyContent: 'center',
  },
});

export default CardEstagio;
