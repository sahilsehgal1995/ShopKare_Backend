from flask import Blueprint, session, url_for, request
from database import categoryProducts, newProducts
import json, gc


def add_routes(app=None):
  Product = Blueprint('Product', __name__, static_url_path='/Product/static', static_folder='./static', template_folder='./templates')
  
  @Product.route('/api/Product')
  def owner():
    return 'Product page'
  
  @Product.route('/api/Product/getCategoryProducts/')
  def getCategoryProducts():
    return categoryProducts(request.args.get('level1Category'), request.args.get('MainCategory'), request.args.get('SubCategory'))
  
  @Product.route('/api/Product/getNewProducts/')
  def getNewProducts():
    return newProducts(request.args.get('level1Category'), request.args.get('MainCategory'), request.args.get('SubCategory'))
  
  app.register_blueprint(Product)