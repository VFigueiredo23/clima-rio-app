from rest_framework import serializers
from .models import AvisoImportante

class AvisoImportanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvisoImportante
        fields = ['id', 'titulo', 'mensagem', 'zona', 'prioridade', 'criado_em']
