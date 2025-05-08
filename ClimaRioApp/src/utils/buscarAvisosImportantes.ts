export const buscarAvisosDeTransito = async (zonaUsuario: string) => {
  try {
    const resposta = await fetch("http://192.168.0.107:8000/avisos/");
    const dados = await resposta.json();

    if (Array.isArray(dados)) {
      // Filtra os avisos do tipo "trânsito"
      const avisosTransito = dados.filter((aviso) => aviso.tipo === 'trânsito');

      // Prioriza os da zona atual do usuário + depois Av Brasil
      const prioridadeZona = avisosTransito.filter(
        (aviso) => aviso.zona.toLowerCase() === zonaUsuario.toLowerCase()
      );

      const prioridadeAvBrasil = avisosTransito.filter(
        (aviso) => aviso.zona.toLowerCase() === 'av brasil'
      );

      const outros = avisosTransito.filter(
        (aviso) =>
          aviso.zona.toLowerCase() !== zonaUsuario.toLowerCase() &&
          aviso.zona.toLowerCase() !== 'av brasil'
      );

      return [...prioridadeZona, ...prioridadeAvBrasil, ...outros];
    } else {
      console.warn("⚠️ Dados inesperados:", dados);
      return [];
    }
  } catch (erro) {
    console.error("❌ Erro ao buscar avisos de trânsito:", erro);
    return [];
  }
};
