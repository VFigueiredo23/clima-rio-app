# testar_robo.py

from buscar_tweets import buscar_clima_twitter

tweet = buscar_clima_twitter()

if tweet:
    print("✅ Tweet coletado com sucesso.")
else:
    print("❌ Nenhum tweet encontrado ou houve erro.")
