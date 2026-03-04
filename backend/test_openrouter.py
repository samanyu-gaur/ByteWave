import requests

response = requests.get("https://openrouter.ai/api/v1/models")
data = response.json()
free_models = [m['id'] for m in data['data'] if m.get('pricing', {}).get('prompt', '0') == '0' and m.get('pricing', {}).get('completion', '0') == '0']

print("Found free models:", len(free_models))
for m in free_models[:10]:
    print(m)
