from flask import Flask, render_template, jsonify, request
import csv
import random

from logic.element import load_elements, random_elements, Display, Element, ElectronDisplay

app = Flask(__name__)

elements = load_elements('static/elements.csv')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate')
def generate():
    return jsonify(random_elements(elements))


@app.route('/result', methods=['GET', 'POST'])
def result():
    data = request.json

    metall = Element(**data['metall'])
    nichtmetall = Element(**data['nichtmetall'])

    metall_left = Display(metall, after_down=metall.molecule)
    metall_right = Display(metall, after_up_number=metall.deficiency, after_up_symbol='+')

    electrons_right = ElectronDisplay(before=metall.deficiency)

    nichtmetall_left = Display(nichtmetall, after_down=nichtmetall.molecule)
    nichtmetall_right = Display(nichtmetall, before=nichtmetall.molecule, after_up_number=nichtmetall.deficiency, after_up_symbol='&#8722')

    electrons_left = ElectronDisplay(before=nichtmetall.deficiency * nichtmetall.molecule)

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
    app.run(debug=True, port=5000)
