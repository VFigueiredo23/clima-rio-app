export const buscarAvisosDeTransito = async (bairroUsuario: string) => {
  try {
    const resposta = await fetch("http://10.50.72.69:8000/avisos/");
    const dados = await resposta.json();

    const mapaBairroZona = {
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

    const zonaUsuario = mapaBairroZona[bairroUsuario] || 'Toda a cidade';
    console.log('📡 Dados brutos da API:', dados);

    const dadosCorrigidos = dados.map(aviso => ({
      ...aviso,
      tipo: aviso.tipo || 'transito',
    }));


    const avisosDeTransito = dados.filter(aviso => {
      const tipoOk = aviso.tipo?.toLowerCase().trim() === 'transito';
      console.log(`🔎 Aviso ${aviso.id} | tipo: "${aviso.tipo}" | tipoOk: ${tipoOk}`);
      return tipoOk;
    });

    const avisosDaZona = avisosDeTransito.filter(aviso => {
      const zonaOk = aviso.zona?.toLowerCase().trim() === zonaUsuario.toLowerCase().trim();
      console.log(`📍 Zona match para ${aviso.id}? ${zonaOk}`);
      return zonaOk;
    });


    const resultadoFinal = avisosDaZona.length > 0 ? avisosDaZona : avisosDeTransito;

    return resultadoFinal;
  } catch (erro) {
    console.error("❌ Erro ao buscar avisos de trânsito:", erro);
    return [];
  }
};
