import pymongo
import json
import os
import gc
from os import walk

base='http://www.filterlady.com/'

def MongoDBconnection(database, collection):
  connection = pymongo.MongoClient("mongodb://localhost")
  db = connection[database]
  cursor = db[collection]
  return connection, db, cursor

def registerDealer(Dealer, pid, pname, MainCategory, SubCategory1):
  connection, db, collection = MongoDBconnection(MainCategory.replace(" ","_"), SubCategory1.replace(" ","_"))
  iter = collection.find({"_id":pid})
  Dealers = list(iter[0]['Dealers'])
  if Dealer in Dealers:
    return 'Already Exists'
  Dealers.append(Dealer)
  collection.update({"_id":pid},{"$set":{"Dealers":Dealers}})
  connection.close()
  gc.collect()
  connection, db, collection = MongoDBconnection('Dealer', Dealer)
  iter = collection.find({"_id":"Product Catalouge"})
  if not iter.count():
    x = dict()
    x[pid] = [pname,MainCategory.replace(" ","_"), SubCategory1.replace(" ","_")]
    collection.insert({"_id":"Product Catalouge","Products":[x]})
    return "Registered"
  newProducts = list(iter[0]['Products'])
  x = dict()
  x[pid] = [pname,MainCategory.replace(" ","_"), SubCategory1.replace(" ","_")]
  newProducts.append(x)
  collection.update({"_id":'Product Catalouge'},{"$set":{"Products":newProducts}})
  connection.close()
  gc.collect()
  return "Registered"

def getProductDetails(pid, MainCategory, SubCategory1):
  connection, db, collection = MongoDBconnection(MainCategory.replace(" ","_"), SubCategory1.replace(" ","_"))
  iter = collection.find({"_id":pid})
  connection.close()
  gc.collect()
  return json.dumps(iter[0])

def registerProduct(user,product):
  product = json.loads(product)
  connection, db, collection = MongoDBconnection(product['Main Category'].replace(" ","_"), product['Sub Category1'].replace(" ","_"))
  iter = collection.find()
  if iter.count():
    response = json.loads(iter)
    product['_id'] = 'P_'+product['Category ID']+'_'+str(int(iter[iter.count()-1]['_id'].split("_")[-1])+1)
  else:
    product['_id'] = 'P_' + product['Category ID']+'_1'
  x = list()
  x.append(user)
  product['Dealers']=x
  collection.insert(product)
  registerDealer(user, product['_id'], product['Name'], product['Main Category'], product['Sub Category1'])
  os.makedirs(os.getcwd()+'/Product/static/Products/'+product['_id']+'/'+user+'/')
  connection.close()
  gc.collect()
  return 'Registered'
  
if __name__ == "__main__":
  #print registerProduct('D_1','{"Category ID":"1_1", "Name":"Persian Tiles", "Main Category":"Building Material","Sub Category1":"Cement and Aggregate", "Brand":[{"Name": "Birla"}, {"_id":"B_1"}]}')
  print getProductDetails('P_1_1_1', 'Building Material', 'Cement and Aggregate')
  #print registerDealer('D_1','P_1_1_1', 'Persian Tiles', 'Building Material', 'Cement and Aggregate')

