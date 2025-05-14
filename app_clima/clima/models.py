from django.db import models

# Lista de zonas da cidade para usar como escolha
ZONAS_CHOICES = [
    ('Centro', 'Centro'),
    ('Zona Norte', 'Zona Norte'),
    ('Zona Sul', 'Zona Sul'),
    ('Zona Oeste', 'Zona Oeste'),
    ('Toda a cidade', 'Toda a cidade'),
    ('Av Brasil', 'Av Brasil'),
]
TIPO_CHOICES = [
    ('clima', 'Clima'),
    ('evento', 'Evento'),
    ('transito', 'transito'),
]


# Modelo principal para armazenar os avisos importantes
class AvisoImportante(models.Model):
    titulo = models.CharField(max_length=100)
    mensagem = models.TextField()
    zona = models.CharField(max_length=20, choices=ZONAS_CHOICES, default='Toda a cidade')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='clima')  # ← Novo campo
    prioridade = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{'[PRIORITÁRIO] ' if self.prioridade else ''}{self.titulo}"

