from flask import Flask, render_template, jsonify, request

from logic.element import load_elements, random_elements, Element
from logic.reaction import RedOx

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
    try:
        redox = RedOx(metal=Element(**data['metall']), nonmetal=Element(**data['nichtmetall']))
    except TypeError:
        return {'content': 'Bitte treffen Sie Ihre Wahl!'}
    return jsonify({'content': ' <br> '.join([reaction.display() for reaction in redox.generate()])})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
