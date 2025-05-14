export const buscarAvisosImportantes = async (bairroUsuario: string) => {
  try {
    const resposta = await fetch("http://10.50.72.69:8000/avisos/");
    const dados = await resposta.json();


    if (!Array.isArray(dados)) return [];

    // 🔄 Mapeia bairro → zona
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

    // 🔢 Prioridade: zona → Av Brasil → outras
    const prioridadeZona = dados.filter(
      (aviso) => aviso.zona.toLowerCase() === zonaUsuario.toLowerCase()
    );

    const prioridadeAvBrasil = dados.filter(
      (aviso) => aviso.zona.toLowerCase() === 'av brasil'
    );

    const outros = dados.filter(
      (aviso) =>
        aviso.zona.toLowerCase() !== zonaUsuario.toLowerCase() &&
        aviso.zona.toLowerCase() !== 'av brasil'
    );

    return [...prioridadeZona, ...prioridadeAvBrasil, ...outros];
  } catch (erro) {
    console.error("❌ Erro ao buscar avisos importantes:", erro);
    return [];
  }
};
