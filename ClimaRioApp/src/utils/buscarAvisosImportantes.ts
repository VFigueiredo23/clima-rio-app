export const buscarAvisosImportantes = async (zonaSelecionada: string) => {
  try {
    const response = await fetch(`http://10.50.72.69:8000/avisos/?zona=${zonaSelecionada}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar avisos importantes:', error);
    return [];
  }
};
