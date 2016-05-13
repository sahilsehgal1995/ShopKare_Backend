from flask import Blueprint, session, request, jsonify
from database import registerCustomer, loginCustomer, FetchOrders, OrderPlacement, NewCourierOrder, addToCart, getCartItems, removeFromCart
import json
import gc
from flask_cors import CORS

from flask_mail import Mail, Message


def add_routes(app=None):
    Customer = Blueprint('Customer', __name__, static_url_path='/Customer/static', static_folder='./static', template_folder='./templates')
    mail = Mail(app)
    # CORS(app, expose_headers=['set-cookie'], allow_headers='*', origins='*', supports_credentials=True)
    @Customer.route('/api/Customer/')
    def home():
        return 'Customer page'

    @Customer.route('/api/Customer/logout/')
    def logout():
        try:
            session.clear()
            gc.collect()
            return 'Logged out'
        except Exception as e:
            return str(e)

    @Customer.route('/api/Customer/login/', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            reply, user = loginCustomer(request.args.get('user'))
            print reply, user
            if reply == 'Login Success':
                session['id'] = user['_id']
                session['Email'] = user['Email']
                session['user'] = 'Customer'
                user['response'] = 'Login Successfull'
                return reply
            else:
                return reply
        return 'Invalid Request'

    @Customer.route('/api/Customer/signup/', methods=['GET', 'POST'])
    def signup():
        if request.method == 'POST':
            reply = registerCustomer(request.args.get('user'))
            return reply
        return 'Invalid Request'

    @Customer.route('/api/Customer/OrderPlacement/', methods=['GET', 'POST'])
    def Orderplacement():

        try:
            if request.method == 'POST':
                print 'user' in session
                if session['user'] == 'Customer':
                    reply = OrderPlacement(request.json, session['id'])
                    print reply
                    msg = Message('Order details', sender='saurabh.1e1@gmail.com', recipients=[reply.pop('email')])

                    msg.html = json.dumps(reply.pop('order')).encode('utf-8')
                    print msg.html
                    mail.send(msg)
                    return jsonify(reply)
                return 'User Not Logged IN'
            return 'Invalid Request'
        except Exception as e:
            return str(e)

    @Customer.route('/api/Customer/NewCourierOrder/', methods=['GET', 'POST'])
    def newCourierOrder():
        try:
            if request.method == 'POST':
                if session['user'] == 'Customer':
                    reply = NewCourierOrder(session['id'], request.args.get('order'))
                    return reply
                return 'User Not Logged IN'
            return 'Invalid Request'
        except Exception as e:
            return str(e)
            return 'Unable to Place order right now'

    @Customer.route('/api/Customer/FetchOrders/', methods=['GET', 'POST'])
    def Fetchorders():
        if request.method == 'POST':
            if session['user'] == 'Customer':
                reply = FetchOrders(session['id'])
                return reply
            return 'User Not Logged IN'
        return 'Invalid Request'

    @Customer.route('/api/Customer/addToCart/', methods=['GET', 'POST'])
    def addtoCart():
        if request.method == 'POST':
            try:
                if session['user'] == 'Customer':
                    reply = addToCart(session['id'], request.args.get('cartItem'))
                    return reply
                return 'User Not Logged IN'
            except Exception as e:
                return 'User Not Logged IN'
        return 'Invalid Request'

    @Customer.route('/api/Customer/removeFromCart/', methods=['GET', 'POST'])
    def RemoveFromCart():
        if request.method == 'POST':
            try:
                if session['user'] == 'Customer':
                    reply = removeFromCart(session['id'], request.args.get('cartItem'))
                    return reply
            except Exception as e:
                return 'User Not Logged IN'
        return 'Invalid Request'

    @Customer.route('/api/Customer/getCartItems/', methods=['GET', 'POST'])
    def GetCartItems():
        if request.method == 'POST':
            return getCartItems('C_1')
            if session['user'] == 'Customer':
                reply = getCartItems(session['id'])
                return reply
            return 'User Not Logged IN'
        return 'Invalid Request'

    app.register_blueprint(Customer)
