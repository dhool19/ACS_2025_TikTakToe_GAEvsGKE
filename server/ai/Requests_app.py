import requests
import json

GKE = "http://34.42.130.108/"
GAE = "https://acs-project-458806.uc.r.appspot.com/"

try:
    print("Checking GKE AI service...")
    res = requests.get(GKE + "health", timeout=2)
    if res.status_code == 200:
        BASE = GKE
        print("Using GKE AI service")
    else:
        raise Exception("Health check failed")
except Exception as e:
    BASE = GAE
    print("GKE unavailable. Using GAE AI service")

# Start a new game with difficulty level
response = requests.post(BASE + "Offline/Start", headers={'Content-Type': 'application/json'}, data=json.dumps({'level': 0.1}))
res = response.json()
print(res['message'])

while not res['end']:
    if response.status_code == 200:
        print(res['board'], '\nAI played at index:', res['index'], '\n')
    else:
        print(res['message'])

    print('Enter your move [1-9] or type "exit" to quit:')
    inp = input('>> ')
    if inp.lower() == 'exit':
        break

    try:
        move_index = int(inp) - 1
        if move_index < 0 or move_index > 8:
            print("Invalid input. Choose a number between 1-9.")
            continue
    except ValueError:
        print("Invalid input. Enter a number.")
        continue

    response = requests.put(BASE + "Offline/Start", headers={'Content-Type': 'application/json'}, data=json.dumps({'level': 4, 'index': move_index}))
    res = response.json()

    if res['end']:
        if res['win']:
            print("\n🎉 You win!")
        elif res['draw']:
            print("\n🤝 It's a draw!")
        else:
            print("\n💀 You've lost!")
        print(res['board'], '\nFinal move index:', res['index'])
        break