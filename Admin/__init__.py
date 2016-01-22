from flask import Blueprint, session, request
from database import loginAdmin, registerAdmin
import json

def add_routes(app=None):
  Admin = Blueprint('Admin', __name__, static_url_path='/Admin/static', static_folder='./static', template_folder='./templates')
  
  @Admin.route('/api/Admin')
  def home():
    return 'Admin page'
  
  @Admin.route('/api/Admin/login/', methods=['GET','POST'])
  def login():
    if request.method == 'POST':
      reply, user = loginAdmin(request.args.get('user'))
      if reply == 'Login Sucess':
	session['id'] = user['_id']
	session['Email'] = user['Email']
	return json.dumps(user)
      else:
	return reply
    return 'Invalid Request'
  
  @Admin.route('/api/Admin/signup/', methods=['GET','POST'])
  def signup():
    if request.method == 'POST':
      reply = registerAdmin(request.args.get('user'))
      return reply
    return 'Invalid Request'
  
  app.register_blueprint(Admin)