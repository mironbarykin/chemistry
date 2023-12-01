from flask import Flask, render_template, jsonify, request
import csv
import random

class Element:
    def __init__(self, name: str, before: int = 1, after_up_number: int = 1, after_up_symbol: str = '', after_down: int = 1) -> None:
        self.name = name

        self.before = before
        self.after_up_number = after_up_number
        self.after_up_symbol = after_up_symbol
        self.after_down = after_down

    def display(self) -> str:
        a = f'{self.before if self.before != 1 else ""}{self.name}'
        b = f'<span class="up">{self.after_up_number if self.after_up_number != 1 else ""}{self.after_up_symbol}</span>'
        c = f'<span class="down">{self.after_down if self.after_down != 1 else ""}</span>'

        return a + b + c


app = Flask(__name__)

elements = list()
with open("static/elements.csv", newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        elements.append(row)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate')
def generate():
    metall = random.choice([element for element in elements if element["M/N"] == "M"])
    nichtmetall = random.choice([element for element in elements if element["M/N"] == "N"])

    return jsonify({"metall": metall, "nichtmetall": nichtmetall})


@app.route('/result', methods=['GET', 'POST'])
def result():
    data = request.json

    metall = Element(data['metall']['kurz'])
    nichtmetall = Element(data['nichtmetall']['kurz'])

    metall_left = Element(metall.name, after_down=int(data['metall']['molekule']))
    metall_right = Element(metall.name, after_up_number=int(data['metall']['edelgaskonfiguration']), after_up_symbol='+')
    electrons_right = Element('<i>e</i>', before = int(data['metall']['edelgaskonfiguration']), after_up_symbol='&#8722')

    nichtmetall_left = Element(nichtmetall.name, after_down=int(data['nichtmetall']['molekule']))
    nichtmetall_right = Element(nichtmetall.name, before=int(data['nichtmetall']['molekule']), after_up_number=int(data['nichtmetall']['edelgaskonfiguration']), after_up_symbol='&#8722')
    electrons_left = Element('<i>e</i>', before = int(data['nichtmetall']['edelgaskonfiguration']) * int(data['nichtmetall']['molekule']), after_up_symbol='&#8722')
    
    oxidation = f'{metall_left.display()} &#10230 {metall_right.display()} + {electrons_right.display()}' 
    reduktion = f'{nichtmetall_left.display()} + {electrons_left.display()} &#10230 {nichtmetall_right.display()}'

    if electrons_left.before != electrons_right.before:
        metall_left.before = metall_left.before * electrons_left.before
        metall_right.before = metall_right.before * electrons_left.before

        nichtmetall_left.before = nichtmetall_left.before * electrons_right.before
        nichtmetall_right.before = nichtmetall_right.before * electrons_right.before

    redox = f'{metall_left.display()} + {nichtmetall_left.display()} &#10230 {metall_right.display()} + {nichtmetall_right.display()}'
    
    return jsonify({'content': f'{oxidation} <br> {reduktion} <br> {redox}'})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
