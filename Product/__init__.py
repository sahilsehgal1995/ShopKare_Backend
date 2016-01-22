from flask import Blueprint, session, url_for, request
from database import registerDealer, registerProduct
import json, gc

base = 'http://www.filterlady.com/'

def add_routes(app=None):
  Product = Blueprint('Product', __name__, static_url_path='/Product/static', static_folder='./static', template_folder='./templates')
  
  @Product.route('/api/Product')
  def owner():
    return 'Product page'
  
  app.register_blueprint(Product)