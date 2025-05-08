export async function buscarPluviometros() {
    try {
      const response = await fetch('https://websempre.rio.rj.gov.br/json/dados_pluviometricos');
      const texto = await response.text();
  
      let dados = {};
      try {
        dados = JSON.parse(texto);
      } catch (erroJSON) {
        console.error('⚠️ Erro ao converter texto para JSON:', erroJSON);
        return 'Erro ao interpretar dados de chuva';
      }
  
      const lista = dados.features;
      if (!Array.isArray(lista)) {
        console.warn('⚠️ Lista "features" não encontrada ou inválida:', lista);
        return 'Formato de dados inesperado';
      }
  
      const ativos = lista.filter(item => {
        const rawValue = item?.properties?.value ?? '0';
        const valor = parseFloat(String(rawValue).replace(',', '.'));
        return valor >= 5;
      });
  
      const textoFinal = ativos.length
        ? `Chuva registrada em: ${ativos.map(p => p.properties.name).join(', ')}`
        : 'Sem registro de chuva significativa no momento';
  
      return textoFinal;
    } catch (error) {
      console.error('❌ Erro ao buscar pluviômetros:', error);
      return 'Erro ao carregar dados de chuva';
    }
  }
  