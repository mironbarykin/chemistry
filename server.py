from flask import Flask, render_template, jsonify
import csv
import random

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


if __name__ == '__main__':
    app.run(debug=True, port=5001)
