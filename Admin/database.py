import pymongo
import json
from passlib.hash import sha256_crypt
import os
import gc

base='http://www.shopkare.com/'

def MongoDBconnection(database, collection):
  connection = pymongo.MongoClient("mongodb://localhost")
  db = connection[database]
  cursor = db[collection]
  return connection, db, cursor

def registerAdmin(user):
  try:
    connection, db, collection = MongoDBconnection('Admin', 'Admin')
    user = json.loads(user)
    if collection.find({'$or':[{"Mobile":user['Mobile']},{"Email":user['Email']}]}).count():
      return 'User Already Exists'
    iter = collection.find()
    if not iter.count():
      user['_id']='A_1'
    else:
      user['_id'] = 'A_'+ str(int(iter[iter.count()-1]['_id'].split("_")[-1])+1)
    user['Password']= sha256_crypt.encrypt(str(user['Password']))
    collection.insert(user)
    connection.close()
    gc.collect()
    return 'Registration Successfull'
  except Exception as e:
    print str(e)
    return 'Unable to Register'

def loginAdmin(user):
  try:
    connection, db, collection = MongoDBconnection('Admin', 'Admin')
    user = json.loads(user)
    iter = collection.find({'$or':[{"Email":user['Email']},{"Mobile":user['Mobile']}]})
    if not iter.count():
      return "User Does't Exists", '[]'
    if sha256_crypt.verify(user['Password'],iter[0]['Password']):
      reply = iter[0]
      connection.close()
      gc.collect()
      del reply['Password']
      return 'Login Sucess', reply
    else:
      return 'Authentication Failed', '[]'
  except Exception as e:
    print str(e)
    return 'Unable to Login'

if __name__ == '__main__':
  #print registerAdmin('{"Name":"Sahil","Password":"123456","Mobile":"9780008628","Email":"sahilsehgal1995@gmail.com"}')
  print loginAdmin('{"Email":"sahilsehgal1995@gmail.com","Password":"123456","Mobile":"9780008628"}')