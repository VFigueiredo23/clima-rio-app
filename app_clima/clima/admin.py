from django.contrib import admin
from .models import AvisoImportante

@admin.register(AvisoImportante)
class AvisoImportanteAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'zona', 'prioridade', 'criado_em')
    list_filter = ('tipo', 'zona', 'prioridade')
    search_fields = ('titulo', 'mensagem')
    fields = ('titulo', 'mensagem', 'zona', 'tipo', 'prioridade')
