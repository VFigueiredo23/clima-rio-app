# robo_clima_oficial.py

import time
from buscar_tweets import buscar_clima_twitter

def iniciar_robo():
    print("🤖 Robô iniciado. Rodando continuamente...\n")
    while True:
        buscar_clima_twitter()
        print("⏳ Aguardando 10 minutos...\n")
        time.sleep(600)  # 600 segundos = 10 minutos

if __name__ == "__main__":
    iniciar_robo()
