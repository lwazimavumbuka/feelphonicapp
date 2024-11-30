from flask import Flask, render_template

feelphonic = Flask(__name__)

@feelphonic.route("/")
def home():
    return render_template('index.html')

if __name__ == '__main__':
    feelphonic.run(debug=True)