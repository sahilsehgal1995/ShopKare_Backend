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

def getProductImages(level1Category, MainCategory, SubCategory, pid):
  try:
    MainCategory = MainCategory.replace(" ","_")
    SubCategory = SubCategory.replace(" ","_")
    level1Category = level1Category.replace(" ","_")
    path = os.getcwd()+"/Product/static/Products/"+ level1Category + '/'+ MainCategory + "/"+ SubCategory + "/"+pid+"/"
    images = list()
    if os.listdir(path):
      for f in os.listdir(path):
	images.append("/Product/static/Products/"+ level1Category + '/'+ MainCategory + "/"+ SubCategory + "/"+pid+"/"+f)
    return images
  except Exception as e:
    return []

def categoryProducts(level1Category, MainCategory, SubCategory):
  try:
    level1Category = level1Category.replace(" ","_")
    MainCategory = MainCategory.replace(" ","_")
    SubCategory = SubCategory.replace(" ","_")
    connection, db, collection = MongoDBconnection(MainCategory.replace(" ","_"), SubCategory.replace(" ","_"))
    iter = collection.find()
    products = list()
    if not iter.count():
      return '[]'
    for i in iter:
      i['images'] = getProductImages(level1Category,MainCategory, SubCategory, i['_id'])
      products.append(i)
    connection.close()
    gc.collect()
    return str(json.dumps(products))
  except Exception as e:
    print str(e)
    return 'Unable to Fetch'
  
def newProducts(level1Category, MainCategory, SubCategory):
  try:
    level1Category = level1Category.replace(" ","_")
    MainCategory = MainCategory.replace(" ","_")
    SubCategory = SubCategory.replace(" ","_")
    connection, db, collection = MongoDBconnection(MainCategory.replace(" ","_"), SubCategory.replace(" ","_"))
    iter = collection.find()
    products = list()
    if not iter.count():
      return '[]'
    for i in iter:
      i['images'] = getProductImages(level1Category,MainCategory, SubCategory, i['_id'])
      products.append(i)
    products= products[::-1]
    connection.close()
    gc.collect()
    return str(json.dumps(products))
  except Exception as e:
    print str(e)
    return 'Unable to Fetch'
    
 
if __name__ == "__main__":
  print newProducts('Grocery', 'Bakery', 'Cakes')
