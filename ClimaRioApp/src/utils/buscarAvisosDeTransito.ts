export const buscarAvisosDeTransito = async (bairroUsuario: string) => {
    try {
      const resposta = await fetch("http://10.50.72.69:8000/avisos/");
      const dados = await resposta.json();
  
      if (!Array.isArray(dados)) {
        console.log('❌ Formato inesperado (não é array)');
        return [];
      }
  
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
  
      console.log('📥 Todos os avisos recebidos:', dados);
      console.log('🏙️ Bairro do usuário:', bairroUsuario);
      console.log('📍 Zona do usuário:', zonaUsuario);
  
      const avisosFiltrados = dados.filter(aviso => {
        const tipoMatch = aviso.tipo?.toLowerCase() === 'transito';
        const zonaMatch = aviso.zona?.toLowerCase() === zonaUsuario.toLowerCase();
  
        console.log(`🧪 Testando aviso ${aviso.id} → tipo: ${aviso.tipo}, zona: ${aviso.zona} | tipoMatch: ${tipoMatch}, zonaMatch: ${zonaMatch}`);
  
        return tipoMatch && zonaMatch;
      });
  
      console.log('🚦 Avisos de trânsito filtrados:', avisosFiltrados);
      return avisosFiltrados;
    } catch (erro) {
      console.error("❌ Erro ao buscar avisos de trânsito:", erro);
      return [];
    }
  };
  