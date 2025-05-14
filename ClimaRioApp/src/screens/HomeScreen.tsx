import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import LottieView from 'lottie-react-native';
import CameraIcon from '../../assets/icons/camera_marker.png';
import CardClimaCarrossel from '../../src/components/CardClimaCarrossel';
import CardDuploCarrossel from '../../src/components/CardDuploCarrossel';
import CardAvisosCarrossel from '../../src/components/CardAvisosCarrossel';
import { buscarTemperaturaDoBairro } from '../../src/utils/buscarTemperaturaDoBairro';
import fundoDiaLimpo from '../../assets/images/dia-limpo-fundo.png';
import fundoNoiteLimpa from '../../assets/images/noite-limpa-fundo.png';
import fundoNubladoDia from '../../assets/images/nublado-fundo.png';
import fundoNubladoNoite from '../../assets/images/noite-nublado-fundo.png';
import fundoalgumasnuvens from '../../assets/images/algumas-nuvens-fundo.png';
import fundoalgumasnuvensnoite from '../../assets/images/algumas-nuvens-noite-fundo.png';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { buscarPluviometros } from '../utils/buscarPluviometros';
import { buscarAvisosImportantes } from '../utils/buscarAvisosImportantes';
import { buscarAvisosDeTransito } from '../utils/buscarAvisosDeTransito';




const obterTemaVisual = (descricaoClima, hora) => {
  const desc = descricaoClima.toLowerCase();
  const ehNoite = hora >= 18 || hora < 6;
  let fundo = '';
  let texto = '';
  if (desc.includes('chuva forte') || desc.includes('tempestade')) {
    fundo = fundoNubladoNoite;
  } else if (
    desc.includes('chuva fraca') ||
    desc.includes('chuva leve') ||
    desc.includes('chuva moderada') ||
    desc.includes('chuvisco')
  ) {
    fundo = ehNoite ? fundoNubladoNoite : fundoNubladoDia;
    texto = ehNoite ? '#eceded' : '#eceded';
  } else if (
    desc.includes('nublado') ||
    desc.includes('muitas nuvens') ||
    desc.includes('névoa') ||
    desc.includes('céu encoberto')
  ) {
    fundo = ehNoite ? fundoNubladoNoite : fundoNubladoDia;
    texto = ehNoite ? '#eceded' : '#eceded';
  } else if (
    desc.includes('limpo') ||
    desc.includes('calor') ||
    desc.includes('céu claro') ||
    desc.includes('ensolarado')
  ) {
    fundo = ehNoite ? fundoNoiteLimpa : fundoDiaLimpo;
    texto = ehNoite ? '#eceded' : '#13335a';
  } else if (
    desc.includes('algumas nuvens') ||
    desc.includes('nuvens dispersas')
  ) {
    fundo = ehNoite ? fundoalgumasnuvensnoite : fundoalgumasnuvens;
    texto = ehNoite ? '#eceded' : '#13335a';
  } else {
    fundo = ehNoite ? 'rgba(15, 23, 42, 0.5)' : 'rgba(240, 248, 255, 0.9)';
  }
  return {
    nome: ehNoite ? 'noite' : 'dia',
    fundo,
    texto,
    card: 'rgba(255, 255, 255, 0.085)',
  };
};

const escolherAnimacaoFundo = (descricao, ehNoite) => {
  const d = descricao.toLowerCase();
  if (d.includes('limpo')) {
    return null;
  } else if ((d.includes('limpo') || d.includes('nuvens') || d.includes('algumas nuvens') )  && ehNoite) {
    return require('../../assets/lottie/estrelas.json');
  } else if ((d.includes('chuva') || d.includes('chovendo') || d.includes('muita chuva') )) {
    return require('../../assets/lottie/chuva-forte-bg.json');
  } else if ((d.includes('chuvisco') || d.includes('chuva leve'))) {
    return require('../../assets/lottie/chuva-fraca-bg.json');
  }  
  return null;
};

const escolherAnimacaoCard = (descricao, ehNoite) => {
  const d = descricao.toLowerCase();
  if (d.includes('chuva forte')) return require('../../assets/lottie/nuvem-chuva-forte.json');
  if (d.includes('chuva')) return require('../../assets/lottie/nuvem-chuvinha.json');
  if (d.includes('nublado')) return require('../../assets/lottie/nuvem-nublado.json');
  if (d.includes('vento')) return require('../../assets/lottie/vento.json');
  if (d.includes('neblina')) return require('../../assets/lottie/nublado-dia.json');
  if (d.includes('algumas nuvens')) return require('../../assets/lottie/nublado-dia.json');
  if (d.includes('nuvens dispersas')) return require('../../assets/lottie/nuvem-nublado.json');
  if (d.includes('claro') || d.includes('sol') || d.includes('limpo'))
    return ehNoite ? require('../../assets/lottie/noite.json') : require('../../assets/lottie/sol.json');
  return ehNoite ? require('../../assets/lottie/noite.json') : require('../../assets/lottie/sol.json');
};





// useState, useEffect, etc
export default function HomeScreen() {
  const listaDeBairros = [
    'Centro',
    'Copacabana',
    'Botafogo',
    'Tijuca',
    'Barra da Tijuca',
    'Jacarepaguá',
    'Madureira',
    'Bangu',
    'Campo Grande',
    'Recreio dos Bandeirantes',
    'Santa Cruz',
    'Lapa',
    'Ipanema',
    'Leblon',
    'Glória',
    'Flamengo',
    'Méier',
    'Penha',
    'Engenho de Dentro',
    'Pavuna',
  ];
  const zonaDoBairro = (bairro) => {
    const zonas = {
      'Centro': 'Centro',
      'Copacabana': 'Zona Sul',
      'Botafogo': 'Zona Sul',
      'Tijuca': 'Zona Norte',
      'Barra da Tijuca': 'Zona Oeste',
      'Jacarepaguá': 'Zona Oeste',
      'Madureira': 'Zona Norte',
      'Bangu': 'Zona Oeste',
      'Campo Grande': 'Zona Oeste',
      'Recreio dos Bandeirantes': 'Zona Oeste',
      'Santa Cruz': 'Zona Oeste',
      'Lapa': 'Centro',
      'Ipanema': 'Zona Sul',
      'Leblon': 'Zona Sul',
      'Glória': 'Centro',
      'Flamengo': 'Zona Sul',
      'Méier': 'Zona Norte',
      'Penha': 'Zona Norte',
      'Engenho de Dentro': 'Zona Norte',
      'Pavuna': 'Zona Norte',
    };
  
    return zonas[bairro] || 'Toda a cidade';
  };
  
  const [bairro, setBairro] = useState('');
  const [dadosClima, setDadosClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [agora, setAgora] = useState(new Date());
  const [indiceUV, setIndiceUV] = useState('Alto');
  const [faseLua, setFaseLua] = useState('Lua Crescente');
  const [mare, setMare] = useState('Maré Alta');
  const [sirenes, setSirenes] = useState('3 sirenes ativas em comunidades do Rio');
  const [pluviometros, setPluviometros] = useState('Chuva forte em Copacabana e Tijuca');
  const [chuvaPluviometro, setChuvaPluviometro] = useState({
    estaChovendo: false,
    intensidade: 'nenhuma',
    descricao: 'Sem chuva',
  });

  const [cameras, setCameras] = useState([]);
  const [mostrarModalRadar, setMostrarModalRadar] = useState(false);
  const [cameraSelecionada, setCameraSelecionada] = useState(null);
  const [bairroSelecionado, setBairroSelecionado] = useState('');
  const [mostrarSeletorBairro, setMostrarSeletorBairro] = useState(false);
  const [bairroAtual, setBairroAtual] = useState('');
  const [bairroManual, setBairroManual] = useState('');
  const [usarManual, setUsarManual] = useState(false);
  const [climaBairro, setClimaBairro] = useState(null);
  const horaAtual = agora.getHours();
  const ehNoite = horaAtual >= 18 || horaAtual < 6;
  const [climaSelecionado, setClimaSelecionado] = useState(null);
  useEffect(() => {
    console.log('🏁 Bairro selecionado no início:', bairroSelecionado);
  }, [bairroSelecionado]);
  const [nivelCalor, setNivelCalor] = useState('1'); 
  const [mostrarModalCalor, setMostrarModalCalor] = useState(false);
  const [avisos, setAvisos] = useState([]);
  const [modalAviso, setModalAviso] = useState(false);
  const [avisoSelecionado, setAvisoSelecionado] = useState<Aviso | null>(null);
  


  const mapaNiveisCalor = {
    '1': {
      titulo: '☀️ Nível de Calor 1',
      descricao: 'Temperaturas normais. Nenhuma ação especial necessária.',
      imagem: require('../../assets/images/nivelCalor-1.png'),
    },
    '2': {
      titulo: '☀️ Nível de Calor 2',
      descricao: 'Calor leve. Beba água e use roupas leves.',
      imagem: require('../../assets/images/nivelCalor-2.png'),
    },
    '3': {
      titulo: '☀️ Nível de Calor 3',
      descricao: 'Calor moderado. Evite exposição direta ao sol entre 10h e 16h.',
      imagem: require('../../assets/images/nivelCalor-3.png'),
    },
    '4': {
      titulo: '☀️ Nível de Calor 4',
      descricao: 'Calor intenso. Risco à saúde de idosos e crianças. Procure sombra e beba muita água.',
      imagem: require('../../assets/images/nivelCalor-4.png'),
    },
    '5': {
      titulo: '☀️ Nível de Calor 5',
      descricao: 'Emergência por calor extremo. Evite qualquer atividade ao ar livre.',
      imagem: require('../../assets/images/nivelCalor-5.png'),
    },
  };
  
  const dadosNivel = mapaNiveisCalor[nivelCalor];

  const explicacoesNiveis = {
    '1': '🌤️ Ações a serem adotadas: Sem impactos na rotina da cidade.',
    '2': '🌤️ Nível 2: Calor moderado. Atenção para hidratação e uso de roupas leves.',
    '3': '🔥 Nível 3: Calor intenso. Evite exposição direta ao sol e fique em locais frescos.',
    '4': '🔥🔥 Nível 4: Calor extremo. Evite exercícios ao ar livre e redobre a hidratação.',
    '5': '🚨 Nível 5: Calor muito perigoso. Situação de alerta máximo, procure abrigo e siga orientações das autoridades.',
  };

  const interpretarChuvaPluviometro = (chuva_mm: number) => {
    if (chuva_mm >= 15) {
      return { estaChovendo: false, intensidade: 'forte', descricao: 'Chuva forte' };
    } else if (chuva_mm >= 5) {
      return { estaChovendo: false, intensidade: 'moderada', descricao: 'Chuva moderada' };
    } else if (chuva_mm > 0) {
      return { estaChovendo: false, intensidade: 'fraca', descricao: 'Chuva fraca' };
    } else {
      return { estaChovendo: true, intensidade: 'nenhuma', descricao: 'Sem chuva' };
    }
  };



  useEffect(() => {
    const carregarAvisos = async () => {
      if (!bairroSelecionado) return;
  
      const zona = zonaDoBairro(bairroSelecionado);
      const lista = await buscarAvisosImportantes(zona);
      setAvisos(lista);
    };
  
    carregarAvisos();
  }, [bairroSelecionado]);
  
  
  const [avisosTransito, setAvisosTransito] = useState([]);

  //Informações sobre card de avisos
  useEffect(() => {
    const carregarTransito = async () => {
      const avisos = await buscarAvisosDeTransito(bairroSelecionado); // ✅ CORRETO
      setAvisosTransito(avisos);
    };

    if (bairroSelecionado) {
      carregarTransito();
    }
  }, [bairroSelecionado]);

  useEffect(() => {
    const carregarPluviometro = async () => {
      const texto = await buscarPluviometros(); // Você já tem esta função
      setPluviometros(texto);

      // Simulação de dado real para integração:
      const dadoSimulado = { chuva_1h: 8 }; // depois substitua pelo dado real
      const interpretacao = interpretarChuvaPluviometro(dadoSimulado.chuva_1h);
      setChuvaPluviometro(interpretacao);
    };

    if (bairroSelecionado) {
      carregarPluviometro();
    }
  }, [bairroSelecionado]);

 

  

  // Funções para salvar e recuperar o bairro
  useEffect(() => {
    const verificarBairroSalvo = async () => {
      try {
        const salvo = await AsyncStorage.getItem('bairroPreferido');
        if (salvo) {
          setBairroSelecionado(salvo);
          console.log('📦 Bairro carregado:', salvo);
        } else {
          console.log('ℹ️ Nenhum bairro salvo — exibir seletor!');
          setMostrarSeletorBairro(true);
        }
      } catch (err) {
        console.error('❌ Erro ao carregar bairro salvo:', err);
      }
    };

    verificarBairroSalvo();
  }, []);

  const descricaoClima = chuvaPluviometro.estaChovendo
    ? `${chuvaPluviometro.descricao} no bairro ${bairroSelecionado}`
    : climaSelecionado?.descricao || '';

  const { animacaoFundo, temaVisual } = useMemo(() => {
    if (!descricaoClima) {
      console.log('⚠️ Sem descrição do clima.');
      return {
        animacaoFundo: null,
        temaVisual: {
          fundo: '#d3d3d3',
          texto: '#fff',
          card: '#111',
        },
      };
    }

    // Priorizar o pluviômetro para fundo
    if (chuvaPluviometro.estaChovendo) {
      const tema = obterTemaVisual(chuvaPluviometro.descricao, horaAtual);
      const animacao =
        chuvaPluviometro.intensidade === 'forte'
          ? require('../../assets/lottie/chuva-forte-bg.json')
          : require('../../assets/lottie/chuva-fraca-bg.json');

      console.log('🌧️ Tema via Pluviômetro:', { tema, animacao });

      return {
        animacaoFundo: animacao,
        temaVisual: tema,
      };
    }

    // Fallback para API externa
    const tema = obterTemaVisual(descricaoClima, horaAtual);
    const animacao = escolherAnimacaoFundo(descricaoClima, ehNoite);

    console.log('🎨 Tema e animação atualizados:', { tema, animacao });

    return {
      animacaoFundo: animacao,
      temaVisual: tema,
    };
  }, [descricaoClima, horaAtual, ehNoite, chuvaPluviometro]);

  

  
  useEffect(() => {
    const timer = setInterval(() => {
      setAgora(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  // 🔥 AQUI É O ÚNICO useEffect de buscar clima
  useEffect(() => {
    const obterClima = async () => {
      if (!bairroSelecionado) return;

      console.log('📥 Buscando temperatura e descrição para:', bairroSelecionado);

      let dadosTemperatura = null;
      try {
        dadosTemperatura = await buscarTemperaturaDoBairro(bairroSelecionado);
      } catch (error) {
        console.error('❌ Erro ao buscar temperatura:', error);
      }

      let descricao = '';
      try {
        descricao = await buscarDescricaoDoClima();
      } catch (error) {
        console.error('❌ Erro ao buscar descrição do clima:', error);
      }

      console.log('✅ Dados buscados:', { dadosTemperatura, descricao });

      if (descricao) {
        const climaComDescricao = {
          ...dadosTemperatura, // mesmo que seja null
          descricao,
        };
        setClimaSelecionado(climaComDescricao);
      } else {
        console.log('⚠️ Sem descrição recebida, não atualizar clima.');
        setClimaSelecionado(null);
      }
    };

    obterClima();
  }, [bairroSelecionado]);

  // Pluviometros
  useEffect(() => {
    const carregarPluviometros = async () => {
      const texto = await buscarPluviometros();
      setPluviometros(texto);
    };
  
    carregarPluviometros();
  }, []);

  const explicacoesDetalhadas = {
    '1': {
      quando: 'Neste primeiro nível, não há previsão de altos índices de calor. A cidade continua com sua rotina normal.',
      acoes: 'Sem impactos na rotina da cidade.',
    },
    '2': {
      quando: 'Quando há previsão ou registro de altos índices de calor (36ºC a 40ºC) por um ou dois dias consecutivos. Neste nível, o COR irá coordenar e disseminar informações sobre sintomas de exposição ao calor e orientar a população com apoio técnico da Secretaria de Saúde.',
      acoes: 'Ainda não há impactos na rotina da cidade, mas os cidadãos devem se manter informados.',
    },
    '3': {
      quando: 'Temperaturas acima de 40ºC por mais de dois dias consecutivos. A cidade entra em estado de atenção reforçada.',
      acoes: 'Evite exposição prolongada ao sol, mantenha-se hidratado e procure locais frescos.',
    },
    '4': {
      quando: 'Calor extremo persistente. Alto risco para a saúde de grupos vulneráveis.',
      acoes: 'Suspensão de atividades ao ar livre recomendada. Prefeitura pode acionar protocolos especiais.',
    },
    '5': {
      quando: 'Emergência climática devido ao calor severo e prolongado.',
      acoes: 'Evite sair de casa. Siga orientações da Defesa Civil e órgãos oficiais.',
    },
  };
  
  

  // 🗺️ Mapeamento manual de bairros para estações reconhecidas na API da Prefeitura
  const mapaBairrosParaEstacoes = {
    'Botafogo': 'Jardim Botânico',
    'Copacabana': 'Jardim Botânico',
    'Ipanema': 'Jardim Botânico',
    'Leblon': 'Jardim Botânico',
    'Barra da Tijuca': 'Barra/Riocentro',
    'Jacarepaguá': 'Barra/Riocentro',
    'Tijuca': 'Alto da Boa Vista',
    'Centro': 'São Cristóvão',
    'Méier': 'São Cristóvão',
    'Santa Cruz': 'Santa Cruz',
    'Guaratiba': 'Guaratiba',
    'Bangu': 'Santa Cruz',
    'Campo Grande': 'Santa Cruz',
    'Engenho de Dentro': 'São Cristóvão',
    'Madureira': 'Irajá',
    'Penha': 'Irajá',
    'Pavuna': 'Irajá',
    'Flamengo': 'Jardim Botânico',
    'Glória':'Jardim Botânico',
    'Lapa':'São Cristovão',
    'Recreio dos Bandeirantes':'Barra/Riocentro', 
    // Adicione mais conforme necessário
  };


  
  const buscarTemperaturaDoBairro = async (bairroAtual) => {
    try {
      console.log('🌡️ Buscando temperatura para:', bairroAtual);
      const nomeParaBuscar = mapaBairrosParaEstacoes[bairroAtual] || bairroAtual;

      const response = await fetch("https://websempre.rio.rj.gov.br/json/temperatura_estacoes");
      const dados = await response.json();
  
      const listaEstacoes = dados.features;
      if (!Array.isArray(listaEstacoes)) {
        console.log('❌ Formato incorreto (esperado array).');
        return null;
      }
      listaEstacoes.forEach((item) => {
        console.log('📍 Estação disponível:', item.properties?.name);
      });
      
  
      const estacaoEncontrada = listaEstacoes.find((item) => {
        const nome = item.properties?.name?.toLowerCase() || '';
        return nome.includes(nomeParaBuscar.toLowerCase());
      });
      
  
      if (estacaoEncontrada) {
        console.log('🎯 Estação encontrada:', estacaoEncontrada.properties);
        return {
          bairro: estacaoEncontrada.properties.name,
          temperatura: estacaoEncontrada.properties.value 
          ? parseFloat(estacaoEncontrada.properties.value) 
          : null,

        };
      } else {
        console.log('⚠️ Nenhuma estação encontrada para o bairro:', bairroAtual);
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao buscar temperatura:', error);
      return null;
    }
  };
  
  const buscarDescricaoDoClima = async () => {
    try {
      console.log('🌐 Buscando descrição do clima...');
      const resposta = await fetch("https://83a0-187-111-99-131.ngrok-free.app/clima/?cidade=Rio de Janeiro");
      const dados = await resposta.json();
      console.log('📝 Descrição recebida:', dados.descricao);
      return dados.descricao;
    } catch (erro) {
      console.error('❌ Erro ao buscar descrição do clima:', erro);
      return '';
    }
  };
  
  
  
  
  // Chama a API quando o bairro for atualizado
  useEffect(() => {
    const obterClima = async () => {
      if (!bairroSelecionado) return;
  
      console.log('📥 Buscando temperatura e descrição para:', bairroSelecionado);
  
      const [dadosTemperatura, descricao] = await Promise.all([
        buscarTemperaturaDoBairro(bairroSelecionado),
        buscarDescricaoDoClima(),
      ]);
  
      if (dadosTemperatura && descricao) {
        const climaComDescricao = {
          ...dadosTemperatura,
          descricao,
        };
        setClimaSelecionado(climaComDescricao);
        console.log('✅ Clima combinado:', climaComDescricao);
      } else {
        console.log('⚠️ Problema ao buscar dados para:', bairroSelecionado);
      }
    };
  
    obterClima();
  }, [bairroSelecionado]);
  

  useEffect(() => {
    const carregarBairroInicial = async () => {
      try {
        const salvo = await AsyncStorage.getItem('bairroPreferido');
  
        if (salvo) {
          setBairroSelecionado(salvo);
          setBairro(salvo);
          console.log('📦 Bairro carregado do AsyncStorage:', salvo);
        } else {
          console.log('ℹ️ Nenhum bairro salvo previamente');
          setMostrarSeletorBairro(true); // mostra o seletor na primeira vez
        }
      } catch (err) {
        console.error('Erro ao carregar bairro salvo:', err);
      }
    };
  
    carregarBairroInicial();
  }, []);

  const salvarBairroLocal = async (bairro) => {
    try {
      await AsyncStorage.setItem('bairroPreferido', bairro);
      console.log('✅ Bairro salvo:', bairro);
    } catch (erro) {
      console.log('Erro ao salvar bairro:', erro);
    }
  };

  const [fontsLoaded] = useFonts({
    'CeraPro-Black': require('../../assets/fonts/CeraProBlack.otf'),
    'CeraPro-Medium': require('../../assets/fonts/CeraProMedium.otf'),
    'CeraPro-Regular': require('../../assets/fonts/CeraProRegular.otf'),
  });
  
  if (!fontsLoaded) {
    return <AppLoading />;
  }
   
  return (
    <View style={{ flex: 1 }}>
      <View key="1"><Text></Text></View>

      {/* Fundo e animação */}
      <ImageBackground
          source={temaVisual.fundo}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          {animacaoFundo && (
            <LottieView
              source={animacaoFundo}
              autoPlay
              loop
              resizeMode="cover"
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              }}
            />
          )}

          {/* Modal personalizado para seleção de bairro */}
          <Modal visible={mostrarSeletorBairro} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
                  Selecione seu bairro:
                </Text>
                <ScrollView style={{ maxHeight: 400 }}>
                  {listaDeBairros.map((bairro) => (
                    <TouchableOpacity
                      key={bairro}
                      onPress={async () => {
                        setBairroSelecionado(bairro);
                        setMostrarSeletorBairro(false);
                        await AsyncStorage.setItem('bairroPreferido', bairro);
                        console.log('✅ Bairro escolhido manualmente:', bairro);
                      }}
                      style={{
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{bairro}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Conteúdo */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[estilos.container, { zIndex: 2 }]}
          >
            {climaSelecionado && (
              <CardClimaCarrossel
                clima={climaSelecionado}
                animacao={escolherAnimacaoCard(climaSelecionado.descricao, ehNoite)}
                tema={temaVisual}
                ehNoite={ehNoite}
                bairroSelecionado={bairroSelecionado}
                onTrocarBairro={() => setMostrarSeletorBairro(true)}
              />
            )}
            {/* Picker de bairro */}
            {usarManual && (
              <View     style={{
                backgroundColor: '#FFF',
                marginTop: 10,
                borderRadius: 10,
                overflow: 'hidden',
                }}>
              </View>
            )}

            {/* Quadro de Avisos Importantes */}
            <CardAvisosCarrossel
                avisos={avisos}
                corTexto={temaVisual.texto}
                corCard={temaVisual.card}
                onPressAviso={(aviso) => {
                    setAvisoSelecionado(aviso);
                    setModalAviso(true);
                }}
            />



            {/* Trânsito e Eventos */}
            <CardDuploCarrossel
              titulo1="🚗 Trânsito"
              paginas1={
                avisosTransito.length > 0
                  ? avisosTransito.map((aviso, index) => (
                      <View key={index}>
                        <Text style={{ color: temaVisual.texto }}>{aviso.titulo}</Text>
                      </View>
                    ))
                  : [
                      <View key="1">
                        <Text style={{ color: temaVisual.texto }}>Sem avisos de trânsito</Text>
                      </View>,
                    ]
              }
              titulo2="🎉 Eventos na cidade"
              paginas2={[
                <View key="1"><Text style={{ color: temaVisual.texto }}>• Show na Lapa com DJs - 20h</Text></View>,
                <View key="2"><Text style={{ color: temaVisual.texto }}>• Feira Cultural na Praça XV - 16h</Text></View>,
                <View key="3"><Text style={{ color: temaVisual.texto }}>• Festival Gastronômico - 12h</Text></View>,
              ]}
              corTexto={temaVisual.texto}
              corCard={temaVisual.card}
            />

            {/* Nivel de calor e ventos */}
            <CardDuploCarrossel
                titulo1=""
                paginas1={[
                    <TouchableOpacity
                      key="1"
                      onPress={() => setMostrarModalCalor(true)}
                      activeOpacity={0.9}
                      style={{ borderRadius: 12, overflow: 'hidden' }}
                    >
                      <Image
                        source={dadosNivel.imagem}
                        style={{ width: 200, height: 100, overflow: 'hidden', marginTop: 0 }}
                        resizeMode= "cover"
                      />
                      
                    </TouchableOpacity>,
                  ]}
                  
                titulo2="💨 Ventos Fortes"
                paginas2={[
                    <View key="1">
                    <Text style={{ color: temaVisual.texto }}>Rajadas moderadas no litoral</Text>
                    <Text style={{ color: temaVisual.texto }}>Velocidade estimada: 35km/h</Text>
                    </View>,
                    <View key="2">
                    <Text style={{ color: temaVisual.texto }}>Sem risco de ressaca no momento</Text>
                    </View>,
                ]}
                corTexto={temaVisual.texto}
                corCard={temaVisual.card}
            />


            {/* Radar Meteorológico */}
            <TouchableOpacity
              onPress={() => setMostrarModalRadar(true)}
              activeOpacity={0.9}
              style={{ height: 200, marginVertical: 10, width: 350 }}
            >
              <Text style={[estilos.blocoTitulo, { color: temaVisual.texto }]}>🌧️ Radar Meteorológico - Sumaré</Text>
              <WebView
                source={{ uri: "http://www.sistema-alerta-rio.com.br/upload/Mapa/mapaRadar.html" }}
                style={{ flex: 1 }}
                scrollEnabled={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            {/* Sirenes e Pluviômetros */}
            <CardDuploCarrossel
              titulo1="📢 Sirenes Ativas"
              paginas1={[
                <View key="1"><Text style={{ color: temaVisual.texto }}>{sirenes}</Text></View>,
              ]}
              titulo2="🌧️ Pluviômetros"
              paginas2={[
                <View key="1">
                  <Text style={{ color: temaVisual.texto }}>
                    {pluviometros.chuva_1h > 0
                      ? `Choveu ${pluviometros.chuva_1h} mm na última hora`
                      : 'Sem registro de chuva no momento'}
                  </Text>
                </View>,
              ]}
            />

            {/* Câmeras ao Vivo */}
            <View style={{ height: 300, width: '100%', marginTop: 20 }}>
              <Text style={[estilos.blocoTitulo, { color: temaVisual.texto }]}>📍 Câmeras em Tempo Real</Text>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: -22.9068,
                  longitude: -43.1729,
                  latitudeDelta: 0.15,
                  longitudeDelta: 0.15,
                }}
              >
                {cameras.map((camera, index) => (
                  <Marker
                    key={index}
                    coordinate={{ latitude: camera.latitude, longitude: camera.longitude }}
                    title={camera.nome}
                    onPress={() => setCameraSelecionada(camera)}
                  >
                    <Image source={CameraIcon} style={{ width: 32, height: 32, resizeMode: 'contain' }} />
                  </Marker>
                ))}
              </MapView>
            </View>

        {/* Contato Rápido */}
        <View style={[estilos.card]}>
          <Text style={[estilos.blocoTitulo, { color: temaVisual.texto }]}>🚨 Contato Rápido</Text>

          <TouchableOpacity
            onPress={() => Linking.openURL('tel:199')}
            style={{ marginBottom: 8 }}
          >
            <Text style={{ color: temaVisual.texto }}>📞 Defesa Civil - 199</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('tel:193')}
            style={{ marginBottom: 8 }}
          >
            <Text style={{ color: temaVisual.texto }}>🚒 Bombeiros - 193</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('tel:190')}
            style={{ marginBottom: 8 }}
          >
            <Text style={{ color: temaVisual.texto }}>🚓 Polícia - 190</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://prefeitura.rio')}
          >
            <Text style={{ color: temaVisual.texto }}>🌐 prefeitura.rio</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>
    </ImageBackground>

    {/* Modal Radar */}
    <Modal visible={mostrarModalRadar} animationType="slide" transparent={true}>
      <View style={estilos.modalContainer}>
        <View style={estilos.modalCard}>
          <Text style={estilos.modalTitulo}>🌧️ Radar Meteorológico</Text>

          <View style={{ width: '100%', height: 300, borderRadius: 12, overflow: 'hidden' }}>
            <WebView
              source={{ uri: "http://www.sistema-alerta-rio.com.br/upload/Mapa/mapaRadar.html" }}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              style={{ flex: 1 }}
            />
          </View>

          <Pressable style={estilos.fecharBotao} onPress={() => setMostrarModalRadar(false)}>
            <Text style={estilos.fecharTexto}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>

    {/* Modal Câmera */}
    <Modal visible={!!cameraSelecionada} animationType="slide" transparent={true}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '90%', height: '70%', backgroundColor: '#000', borderRadius: 12, overflow: 'hidden' }}>
          <Pressable onPress={() => setCameraSelecionada(null)} style={{ padding: 10, alignSelf: 'flex-end' }}>
            <Text style={{ color: '#FFF' }}>✖ Fechar</Text>
          </Pressable>
          <WebView
            source={{ uri: cameraSelecionada?.stream }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      </View>
    </Modal>

    {/* Modal Nivel de calor */}
    <Modal
    visible={mostrarModalCalor}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setMostrarModalCalor(false)}
    >
    <View style={estilos.modalContainer}>
        <View style={[estilos.modalCard, { paddingBottom: 20 }]}>
        <Image
            source={dadosNivel.imagem}
            style={{ width: '100%', height: 100, marginBottom: 16, borderRadius: 10 }}
            resizeMode="contain"
        />

        <Text style={[estilos.modalTexto, { fontWeight: 'bold', marginTop: 10 }]}>Quando:</Text>
        <Text style={estilos.modalTexto}>
            {explicacoesDetalhadas[nivelCalor]?.quando}
        </Text>

        <Text style={[estilos.modalTexto, { fontWeight: 'bold', marginTop: 12 }]}>Ações a serem adotadas:</Text>
        <Text style={estilos.modalTexto}>
            {explicacoesDetalhadas[nivelCalor]?.acoes}
        </Text>

        <Pressable style={estilos.fecharBotao} onPress={() => setMostrarModalCalor(false)}>
            <Text style={estilos.fecharTexto}>Fechar</Text>
        </Pressable>
        </View>
    </View>
    </Modal>

    {modalAviso && avisoSelecionado && (
    <Modal visible={true} animationType="slide" transparent={true}>
        <View style={estilos.modalContainer}>
        <View style={estilos.modalCard}>
            <Text style={[estilos.modalTitulo, { color: '#fff', fontSize: 24, alignItems: 'center', marginBottom: 20 }]}>
             {avisoSelecionado.titulo}
            </Text>
            <ScrollView style={{ marginBottom: 20 }}>
            <Text style={[estilos.modalTexto, { color: '#fff', fontSize: 14 }]}>
                {avisoSelecionado.mensagem}
            </Text>
            </ScrollView>
            <Pressable style={estilos.fecharBotao} onPress={() => setModalAviso(false)}>
            <Text style={estilos.fecharTexto}>Fechar</Text>
            </Pressable>
        </View>
        </View>
    </Modal>
    )}




  </View>
); // fim do return

} // fim da função Page

const estilos = StyleSheet.create({
  
  container: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'CeraPro-Black'
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    backgroundColor: 'rgba(232, 232, 232, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cidade: {
    fontSize: 22,
    fontWeight: '600',
  },
  temperatura: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  icone: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  erro: {
    color: 'red',
    marginTop: 10,
  },
  blocoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#13335a',
    width: '90%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitulo: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  modalTexto: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  fecharBotao: {
    backgroundColor: '#42b9eb',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 15,
  },
  fecharTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },

  listaAvisos: {
    marginTop: 10,
    width: '100%',
    color: '#E5E7EB',
  },
  itemAviso: {
    fontSize: 14,
    marginBottom: 4,
    
  },
  verMais: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
  },

  alertasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  iconeAlerta: {
    width: 160,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  dataHora: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  
  lottieAnimacao: {
    width: 120,
    height: 120,
    marginTop: 10,
  },

  linhaBlocos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8, 
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  
  blocoLado: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(232, 232, 232, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
    
  
});


