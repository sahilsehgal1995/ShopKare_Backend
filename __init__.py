from flask import Flask, url_for
from flask.ext.cors import CORS
import Customer, Admin, Product

app = Flask(__name__)
app.config['SECRET_KEY'] = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
app.config['UPLOAD_FOLDER'] = '.'
app.config['MAX_CONTENT_LENGTH'] = 18 * 1024 * 1024
app.config['DEBUG'] = False
app.config['TESTING'] = False

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'saurabh.1e1@gmail.com'
app.config['MAIL_PASSWORD'] = 'Django_Flask_LinusTorvalds'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True


CORS(app)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

@app.route("/")
def home():
  try:
    return app.send_static_file("index.html")
  except Exception as e:
    return str(e)

Admin.add_routes(app)
Customer.add_routes(app)
Product.add_routes(app)

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=7000)
