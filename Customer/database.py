import pymongo
import json
from passlib.hash import sha256_crypt
import datetime
import os
import gc

base='http://www.shopkare.com/'

def MongoDBconnection(database, collection):
  connection = pymongo.MongoClient("mongodb://localhost")
  db = connection[database]
  cursor = db[collection]
  return connection, db, cursor

def registerCustomer(user):
  try:
    connection, db, collection = MongoDBconnection('Customer', 'Customers')
    user = json.loads(user)
    if collection.find({'$or':[{"Mobile":user['Mobile']},{"Email":user['Email']}]}).count():
      return 'User Already Exists'
    iter = collection.find()
    if not iter.count():
      user['_id']='C_1'
    else:
      user['_id'] = 'C_'+ str(int(iter[iter.count()-1]['_id'].split("_")[-1])+1)
    user['Password']= sha256_crypt.encrypt(str(user['Password']))
    collection.insert(user)
    connection.close()
    gc.collect()
    return 'Registration Successfull'
  except Exception as e:
    print str(e)
    return 'Unable to Register'

def loginCustomer(user):
  try:
    connection, db, collection = MongoDBconnection('Customer', 'Customers')
    user = json.loads(user)
    iter = collection.find({'$or':[{"Email":user['Email']},{"Mobile":user['Mobile']}]})
    if not iter.count():
      return "User Does't Exists", '[]'
    print iter[0]['Password']
    if sha256_crypt.verify(user['Password'],iter[0]['Password']):
      reply = iter[0]
      connection.close()
      gc.collect()
      del reply['Password']
      connection.close()
      gc.collect()
      return 'Login Success', reply
    else:
      connection.close()
      gc.collect()
      return 'Authentication Failed', '[]'
  except Exception as e:
    return str(e)
    return 'Unable to Login', '[]'

def addToCart(cid, cartItem):
  try:
    connection, db, collection = MongoDBconnection('Cart', cid)
    cartItem = json.loads(cartItem)
    iter = collection.find()
    if iter.count():
      print 'hello world'
    connection.close()
    gc.collect()
    return ''
  except Exception as e:
    print str(e)
    return 'Unable to Add to cart'

def OrderPlacement(cartItems, cid):
  try:
    connection, db, collection = MongoDBconnection('Customer', cid)
    cartItems = json.loads(cartItems)
    iter = collection.find()
    if not iter.count():
      cartItems['_id']='O'+cid+'-1'
    else:
      cartItems['_id'] = 'O'+cid+ '-'+ str(int(iter[iter.count()-1]['_id'].split("_")[-1])+1)
    cartItems['Status']= 'Pending'
    dt = datetime.now()
    cartItems['OrderDate']= dt.strftime("%A, %d. %B %Y %I:%M%p")
    collection.insert(cartItems)
    connection.close()
    gc.collect()
    cartItems['cid']= cid
    connection, db, collection = MongoDBconnection('Admin', 'Orders')
    cartItems['DeliveryBoy']=[]
    collection.insert(cartItems)
    return 'Order Placed'
  except Exception as e:
    print str(e)
    return 'Unable to Place'

def NewCourierOrder(cid,order):
  try:
    connection, db, collection = MongoDBconnection('Courier', cid)
    order = json.loads(order)
    order['status']= 'Fresh'
    iter = collection.find()
    if not iter.count():
      order['_id']='CO_'+'1'
    else:
      order['_id'] = 'CO_' + str(int(iter[iter.count()-1]['_id'].split("_")[-1])+1)
    collection.insert(order)
    connection.close()
    gc.collect()
    connection, db, collection = MongoDBconnection('Courier', 'Orders')
    order['cid']=cid
    collection.insert(order)
    connection.close()
    gc.collect()
    return 'Order Placed'
  except Exception as e:
    print str(e)
    return 'Unable to Fetch'


def FetchOrders(cid):
  try:
    connection, db, collection = MongoDBconnection('Customer', cid)
    cartItems = json.loads(cartItems)
    iter = collection.find()
    if not iter.count():
      return '[]'
    return str(json.dumps(products))
  except Exception as e:
    print str(e)
    return 'Unable to Fetch'
  


if __name__ == '__main__':
  #print registerCustomer('{"Name":"Sahil","Password":"123456","Mobile":"9780008628","Email":"sahilsehgal1995@gmail.com"}')
  print loginCustomer('{"Email":"sahilsehgal1995@gmail.com","Password":"123456","Mobile":"9780008628"}')
