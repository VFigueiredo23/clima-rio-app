from django.shortcuts import render
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from rest_framework import status
from .models import AvisoImportante
from .serializers import AvisoImportanteSerializer

class ClimaView(APIView):
    def get(self, request):
        cidade = request.GET.get('cidade', 'São Paulo')
        api_key = settings.OPENWEATHER_API_KEY
        url = f'https://api.openweathermap.org/data/2.5/weather?q={cidade}&appid={api_key}&units=metric&lang=pt_br'

        try:
            resposta = requests.get(url).json()

            if resposta.get("cod") != 200:
                raise ValueError("Erro ao buscar clima")

            icone_codigo = resposta['weather'][0]['icon']
            icone_url = f"http://openweathermap.org/img/wn/{icone_codigo}@2x.png"

            dados = {
                'cidade': resposta['name'],
                'temperatura': resposta['main']['temp'],
                'descricao': resposta['weather'][0]['description'],
                'icone': icone_url,
            }

            return Response(dados)

        except Exception as e:
            return Response({'erro': 'Cidade inválida ou erro ao consultar API'}, status=400)
        
class AvisosImportantesView(APIView):
    def get(self, request):
        avisos = AvisoImportante.objects.order_by('-prioridade', '-criado_em')[:10]
        serializer = AvisoImportanteSerializer(avisos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)        
