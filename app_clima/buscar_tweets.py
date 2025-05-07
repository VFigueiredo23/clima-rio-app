import requests
import json
import time

def buscar_clima_twitter():
    print("📡 Coletando clima via API oficial do Twitter...")

    bearer_token = "AAAAAAAAAAAAAAAAAAAAABx90gEAAAAAN9V%2B0gkOzNzDh6ZJbpWEBGVV6BY%3D0PaTVBOHG3WDdbsswbWW1BQcOTFyvic1dJdMh35niLZsjtau6c"
    headers = {
        "Authorization": f"Bearer {bearer_token}",
    }

    query = "(from:OperacoesRio) (#tempoRJ)"
    url = "https://api.twitter.com/2/tweets/search/recent"
    params = {
        "query": query,
        "max_results": 10,
        "tweet.fields": "created_at,text",
    }


    print(f"🔍 Requisição em: {url}")

    response = requests.get(url, headers=headers, params=params)

    # Trecho para esperar 20min e depois rodar novamente
    if response.status_code == 429:
        print("⚠️ Limite de requisições atingido (erro 429). Aguardando 20 minutos para tentar novamente...")
        time.sleep(1200)  # espera 20 minutos
        return None


    if response.status_code != 200:
        print(f"⚠️ Erro {response.status_code} ao acessar a API: {response.text}")
        return

    dados = response.json()
    tweets = dados.get("data", [])

    if tweets:
        tweet = tweets[0]
        tweet_text = tweet["text"]
        created_at = tweet["created_at"]
        print(f"📄 Último Tweet:\n{tweet_text}\n🕒 {created_at}\n")

        # Salvando em arquivo JSON
        with open("ultimo_clima.json", "w", encoding="utf-8") as f:
            json.dump(tweet, f, ensure_ascii=False, indent=2)

        return tweet
    else:
        print("❌ Nenhum tweet encontrado.")
        return None


