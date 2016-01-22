from flask import Blueprint, session

def add_routes(app=None):
  Customer = Blueprint('Customer', __name__, static_url_path='/Customer/static', static_folder='./static', template_folder='./templates')
  
  @Customer.route('/api/Customer')
  def home():
    return 'Customer page'
  
  app.register_blueprint(Customer)