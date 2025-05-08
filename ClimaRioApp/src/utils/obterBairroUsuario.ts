import * as Location from 'expo-location';

export async function obterBairroUsuario() {
  try {
    // Solicita permissão de acesso à localização
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ Permissão para acessar localização foi negada');
      return null;
    }

    // Pega a localização atual do usuário
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    console.log(`📍 Localização atual: ${latitude}, ${longitude}`);

    // Converte latitude e longitude em um endereço (geocodificação reversa)
    const enderecos = await Location.reverseGeocodeAsync({ latitude, longitude });

    // Pega o bairro (suburb no Android, district no iOS)
    const bairro = enderecos[0]?.suburb || enderecos[0]?.district || 'Bairro desconhecido';

    console.log(`🏘️ Bairro detectado: ${bairro}`);
    return bairro;
  } catch (erro) {
    console.error('❌ Erro ao obter localização:', erro);
    return null;
  }
}
