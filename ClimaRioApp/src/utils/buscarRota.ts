import polyline from '@mapbox/polyline';

export const buscarRotaGoogle = async (origem, destino) => {
  const chave = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origem.lat},${origem.lng}&destination=${destino.lat},${destino.lng}&mode=driving&key=${chave}`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    if (!dados.routes || dados.routes.length === 0) {
      console.warn('⚠️ Nenhuma rota encontrada');
      return null;
    }

    const rota = dados.routes[0];
    const tempo = rota.legs[0].duration.text;
    const pontos = polyline.decode(rota.overview_polyline.points).map(([lat, lng]) => ({
      latitude: lat,
      longitude: lng,
    }));

    return {
      tempo,
      rota: pontos,
    };
  } catch (erro) {
    console.error('❌ Erro ao buscar rota:', erro);
    return null;
  }
};
