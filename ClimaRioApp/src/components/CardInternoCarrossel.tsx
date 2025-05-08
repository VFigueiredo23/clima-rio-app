import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEve
} from 'react-native';

interface Props {
  titulo: string;
  paginas: React.ReactNode[];
  corTexto: string;
  corCard: string;
}

const largura = Dimensions.get('window').width;
const larguraSlide = largura * 0.82;
const [paginaAtual, setPaginaAtual] = useState(0);
const scrollRef = useRef<ScrollView>(null);

const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const posicaoX = event.nativeEvent.contentOffset.x;
    const pagina = Math.round(posicaoX / larguraSlide);
    setPaginaAtual(pagina);
  };

export default function CardInternoCarrossel({ titulo, paginas, corTexto, corCard }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: corCard }]}>
      <Text style={[styles.titulo, { color: corTexto }]}>{titulo}</Text>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={larguraSlide}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {paginas.map((conteudo, index) => (
            <View style={styles.indicadorContainer}>
                {paginas.map((_, index) => (
                    <View
                    key={index}
                    style={[
                        styles.bolinha,
                        { opacity: paginaAtual === index ? 1 : 0.3 },
                    ]}
                    />
                ))}
            </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 16,
    //backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    //borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
  },
  slide: {
    marginRight: 8,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    //backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  indicadorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  bolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff', // ou cor dinâmica com tema
  },
});
