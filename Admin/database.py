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
      connection.close()
      gc.collect()
      return 'Login Sucess', reply
    else:
      connection.close()
      gc.collect()
      return 'Authentication Failed', '[]'
  except Exception as e:
    print str(e)
    return 'Unable to Login'

def registerProduct(MainCategory, SubCategory, product):
  try:
    MainCategory = MainCategory.replace(" ","_")
    SubCategory = SubCategory.replace(" ","_")
    product = json.loads(product)
    connection, db, collection = MongoDBconnection(MainCategory, SubCategory)
    iter = collection.find()
    if not iter.count():
      product['_id']='P_'+product['_id']+'_1'
    else:
      product['_id'] = 'P_'+product['_id']+'_'+ str(int(iter[iter.count()-1]['_id'].split("_")[-1])+1)
    collection.insert(product)
    connection.close()
    gc.collect()
    return 'Registered'
  except Exception as e:
    print str(e)
    return 'Unable to Register'

def removeProduct(MainCategory, SubCategory, pid):
  try:
    MainCategory = MainCategory.replace(" ","_")
    SubCategory = SubCategory.replace(" ","_")
    connection, db, collection = MongoDBconnection(MainCategory, SubCategory)
    iter = collection.find({"_id":pid}).count()
    if iter:
      collection.remove({"_id":pid})
      connection, db, collection = MongoDBconnection('Batches', pid)
      db.drop_collection(pid)
    else:
      return 'Unable to Remove'
    connection.close()
    gc.collect()
    return 'Removed'
  except Exception as e:
    return 'Unable to Remove'

def ProductImagePath(MainCategory, SubCategory, pid):
  try:
    MainCategory = MainCategory.replace(" ","_")
    SubCategory = SubCategory.replace(" ","_")
    path = os.getcwd()+"/Product/static/Products/"+MainCategory+"/"+SubCategory+"/"+pid+"/"
    if not os.path.exists(path):
      os.makedirs(os.getcwd()+"/Product/static/Products/"+MainCategory+"/"+SubCategory+"/"+pid+"/")
    return os.getcwd()+"/Product/static/Products/"+MainCategory+"/"+SubCategory+"/"+pid+"/"
  except Exception as e:
    return 'Unable to fetch'

def AddBatch(pid, Batch):
  try:
    Batch = json.loads(Batch)
    connection, db, collection = MongoDBconnection('Batches', pid)
    iter = collection.find()
    if not iter.count():
      Batch['_id']='B_1'
    else:
      Batch['_id'] = 'B_'+str(int(iter[iter.count()-1]['_id'].split("_")[-1])+1)
    collection.insert(Batch)
    return "Added"
  except Exception as e:
    print str(e)
    return 'Unable to Add'

def RemoveBatch(pid, BatchID):
  try:
    connection, db, collection = MongoDBconnection('Batches', pid)
    iter = collection.find({"_id":BatchID}).count()
    if not iter:
      connection.close()
      gc.collect()
      return "Unable to Remove"
    collection.remove({"_id":BatchID})
    connection.close()
    gc.collect()
    return "Removed"
  except Exception as e:
    print str(e)
    return 'Unable to Remove'


if __name__ == '__main__':
  print RemoveBatch('P_1_1_1',"B_3")
  #print AddBatch('P_1_1_1','{"Product Name": "Cocacola", "Quantity":10, "Quantity Unit":"Number", "SP":15, "CP":18}')
  #print registerAdmin('{"Name":"Sahil","Password":"123456","Mobile":"9780008628","Email":"sahilsehgal1995@gmail.com"}')
  #print loginAdmin('{"Email":"sahilsehgal1995@gmail.com","Password":"123456","Mobile":"9780008628"}')
  #print registerProduct('Snacks Beverages','Cold Drinks','{"_id":"1_1","Name":"Coke", "Brand":"CocaCola"}')
  #print removeProduct('Snacks Beverages','Cold Drinks','P_1_1_1')