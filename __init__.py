from flask import Flask, url_for
import Customer, Admin, Product
app = Flask(__name__)
app.config['SECRET_KEY'] = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

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
  app.run()