import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';

const largura = Dimensions.get('window').width;

interface Props {
  titulo: string;
  paginas: React.ReactNode[];
  corTexto: string;
  corCard: string;
}

export default function CardHorizontalCarrossel({ titulo, paginas, corTexto, corCard }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: corCard }]}>
    <Text style={[styles.titulo, { color: corTexto }]}>{titulo}</Text>

    <ScrollView
        horizontal
        pagingEnabled
        snapToInterval={larguraInterna}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 0 }}
        >
        {paginas.map((conteudo, index) => (
            <View key={index} style={[styles.paginaInterna]}>
            {conteudo}
            </View>
        ))}
    </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({
    paginaInterna: {
        width: 260, // ou a largura interna do card (ajuste conforme necessário)
        padding: 10,
        borderRadius: 12,
      },
      
      slideInterno: {
        width: 160,
        padding: 10,
        marginRight: 8,
        backgroundColor: 'rgba(232,232,232,0.08)',
        borderRadius: 10,
      },
      
      
});
