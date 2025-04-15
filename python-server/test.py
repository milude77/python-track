import requests
import json


url = 'http://127.0.0.1:5000/api/model_key'


payload = {
    "operate": "get"
}


response = requests.post(url, json=payload)
response_push = requests.post(url, json={"operate": "push", "model_name": "test_model", "key_name": "test_key", "model_key": "test_value"})
response_remove = requests.post(url, json={"operate": "delete", "model_name": "test_model", "key_name": "test_key"})


print(response_push.status_code)
print(response_push.json())
print(response_remove.status_code)
print(response_remove.json())
print(response.status_code)
print(response.json())
