export async function buscarTemperaturaDoBairro(bairroAtual: string) {
    try {
      const response = await fetch("https://websempre.rio.rj.gov.br/json/temperatura_estacoes");
      const dados = await response.json();
  
      const estacaoEncontrada = dados.find((item) => {
        const bairroEstacao = item.bairro?.toLowerCase() || '';
        return bairroEstacao.includes(bairroAtual.toLowerCase());
      });
  
      if (estacaoEncontrada) {
        console.log('🌡️ Estação encontrada:', estacaoEncontrada);
        return estacaoEncontrada;
      }
      else {
        return null
      }

      
  
    } catch (error) {
      console.error("Erro ao buscar temperatura:", error);
    }
  }
  