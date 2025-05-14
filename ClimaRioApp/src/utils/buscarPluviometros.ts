const MODO_DEBUG = true; // ✅ Coloque false para voltar ao normal depois
const CHUVA_SIMULADA = 10; // ✅ Valor em mm para simular (0, 5, 10, 20...)
export const buscarPluviometros = async (bairroSelecionado: string) => {
  try {
    const response = await fetch('https://websempre.rio.rj.gov.br/json/dados_pluviometricos');
    const dados = await response.json();

    const listaPluviometros = Array.isArray(dados.features)
      ? dados.features
      : [];

    if (listaPluviometros.length === 0) {
      console.error('❌ Nenhum dado de pluviômetro encontrado.');
      return { chuva_1h: 0 };
    }

    const mapaBairrosParaEstacoes = {
      'Copacabana': 'Copacabana',
      'Centro': 'Centro',
      'Tijuca': 'Tijuca',
      'Barra da Tijuca': 'Barra',
      'Jacarepaguá': 'Jacarepaguá',
      'Vidigal': 'Vidigal',
      // Adicione mais se necessário
    };

    const nomeEstacao = mapaBairrosParaEstacoes[bairroSelecionado] || bairroSelecionado;

    const estacaoEncontrada = listaPluviometros.find((item) => {
      if (!item.station || !item.station.name) {
        return false; // pula esse item
      }

      const nomeEstacaoAPI = item.station.name.toLowerCase();
      return nomeEstacaoAPI.includes(nomeEstacao.toLowerCase());
    });


    if (estacaoEncontrada) {
      console.log('🌧️ Estação Pluviômetro encontrada:', estacaoEncontrada.station.name, 'chuva_1h:', estacaoEncontrada.chuva_1h);

      // 🧪 Forçando simulação de chuva forte:
      const chuvaSimulada = 10; // <-- AQUI VOCÊ SIMULA

      return {
        chuva_1h: chuvaSimulada,
      };
    } else {
      console.warn('⚠️ Nenhuma estação de pluviômetro encontrada para:', bairroSelecionado);
      return { chuva_1h: 0 };
    }

  } catch (error) {
    console.error('❌ Erro ao buscar pluviômetros:', error);
    return { chuva_1h: 0 };
  }
};
