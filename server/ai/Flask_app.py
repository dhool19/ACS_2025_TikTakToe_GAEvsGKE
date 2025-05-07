from TicTacToe import *

from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource, request, reqparse, abort, fields, marshal_with
from flask import g
import numpy as np

import os
import time
import multiprocessing


app = Flask(__name__)
CORS(app)
api = Api(app)
board = None


# Health check route
@app.route('/health')
def health_check():
    return "✅ AI-Service is Up and Running!", 200

# ready = False

# Middleware
@app.before_request
def before_request():
    g.start = time.time()
    app.logger.info(f"➡️ Handling request: {request.method} {request.url}")

@app.after_request
def after_request(response):
    diff = time.time() - g.start
    app.logger.info(f"⏱ Request time: {diff:.4f} sec")
    return response

# Stress functions
def stress_worker(duration_sec):
    start = time.time()
    while time.time() - start < duration_sec:
        a = np.random.rand(200, 200)
        b = np.random.rand(200, 200)
        np.matmul(a, b)

def run_stress(cpu_cores=2, duration_sec=3):
    processes = []
    for _ in range(cpu_cores):
        p = multiprocessing.Process(target=stress_worker, args=(duration_sec,))
        p.start()
        processes.append(p)
    for p in processes:
        p.join()

def start_background_stress(cpu_cores=2, duration_sec=3):
    p = multiprocessing.Process(target=run_stress, args=(cpu_cores, duration_sec))
    p.start()

class Start(Resource):

    def post(self):
        global board
        
        data = request.get_json()
        if not data or 'level' not in data:
            return {"message": "Missing 'level' in request."}, 400
        
        board = Board(data['level'])
        board.reset()
        if os.getenv("STRESS_MODE") == "on":
            print("🔥 Starting background stress...")
            start_background_stress(cpu_cores=4, duration_sec=6)

        return {"message": "Welcome to Tic Tac Toe game by OMHNS", "board": board.state.tolist(), 'index': '', 'win': False, 'draw': False, 'end': False}, 200
    
    def put(self):
        global board
        win = False
        draw = False
        end = False

        data = request.get_json()

        
        move = data['index']
        if move == 'exit':
            return {"message": 'End game!', 'board': board.state.tolist(), 'index': '', 'win': win, 'draw': draw, 'end': end}, 200

        # create MCTS instance
        mcts = board.mcts
        # mcts = MCTS(data['level'])

        # check if the input is empty
        if move == None:
            return {"message": 'No move selected!', 'board': board.state.tolist(), 'index': '', 'win': win, 'draw': draw, 'end': end}, 400
        
        try:
            # check if the move is legal
            if board.state[move] != board.empty_cara:
                return {"message": 'Illegal move!', 'board': board.state.tolist(), 'index': '', 'win': win, 'draw': draw, 'end': end}, 400

            # make the move
            board = board.make_move(move)
            
            # search for the best move
            best_move = mcts.search(board, move)

            # make AI move here
            board = best_move.board

        except Exception as e:
            print("Error: ", e)
            return {"message": 'Invalid move!', 'board': board.state.tolist(), 'index': '', 'win': win, 'draw': draw, 'end': end}, 400

        # check if win or draw and break if so
        if board.is_win():
            if board.player_2 == 'X':
                win = True
                end = True
                return {"message": '', 'board': board.state.tolist(), 'index': None, 'win': win, 'draw': draw, 'end': end}, 200
                
            end = True
            return {"message": '', 'board': board.state.tolist(), 'index': best_move.index, 'win': win, 'draw': draw, 'end': end}, 200

        elif board.is_draw():
            draw = True
            end = True
            return {"message": '', 'board': board.state.tolist(), 'index': None, 'win': win, 'draw': draw, 'end': end}, 200

        print(best_move.index)
        return {"message": '', 'board': board.state.tolist(), 'index': best_move.index, 'win': win, 'draw': draw, 'end': end}, 200
    

api.add_resource(Start, "/Offline/Start")

if __name__ == '__main__':
    app.run(debug=True)

