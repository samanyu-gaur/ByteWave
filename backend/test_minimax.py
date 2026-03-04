import os
import requests
import sys

def test_minimax():
    api_key = os.getenv("MINIMAX_API_KEY", "")
    if not api_key:
        print("Please set MINIMAX_API_KEY environment variable")
        return
        
    url = "https://api.minimax.io/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    group_id = os.getenv("MINIMAX_GROUP_ID", "")
    if group_id:
        headers["GroupId"] = group_id
        
    data = {
        "model": "MiniMax-M2.5",
        "messages": [
            {"role": "user", "content": "Hello"}
        ]
    }
    
    print(f"Testing Minimax API with key starting with: {api_key[:5]}...")
    print(f"URL: {url}")
    print(f"Headers: {headers}")
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        response.raise_for_status()
        print("Success!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_minimax()
