import pymongo
import json
import os
import gc
from os import walk
from random import randint

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
    connection, db, collection = MongoDBconnection(MainCategory, SubCategory)
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

def randomSubCategory(id, mainCategory, mainCategoryIndex):
  connection, db, collection = MongoDBconnection('Admin', 'Categories')
  iter = collection.find({"_id":id})
  subCategoryIndex = randint(0,len(iter[0]['Categories'][mainCategoryIndex][mainCategory])-1)
  subCategory = iter[0]['Categories'][mainCategoryIndex][mainCategory][subCategoryIndex]
  connection.close()
  gc.collect()
  return subCategory, subCategoryIndex

def randomCategory(id):
  connection, db, collection = MongoDBconnection('Admin', 'Categories')
  iter = collection.find({"_id":id})
  randnumber = randint(0,len(iter[0]['Categories']) -1)
  categories = iter[0]['Categories']
  mainCategory = categories[randnumber]
  subCategory, subCategoryIndex = randomSubCategory(id, mainCategory.keys()[0], randnumber)
  connection.close()
  gc.collect()
  return mainCategory.keys()[0], randnumber, subCategory, subCategoryIndex

def randomProducts(id):
  mainCategory, mainCategoryIndex, subCategory, subCategoryIndex = randomCategory(id)
  print mainCategory, mainCategoryIndex, subCategory, subCategoryIndex
  return categoryProducts(id, mainCategory, subCategory)

def randomMainCategoryProducts(id, mainCategory):
  connection, db, collection = MongoDBconnection('Admin', 'Categories')
  iter = collection.find({"_id":id})
  for index, category in enumerate(iter[0]['Categories']):
    if mainCategory == category.keys()[0]:
      mainCategoryIndex = index
      break
  subCategory, subCategoryIndex = randomSubCategory(id, mainCategory, mainCategoryIndex)
  return categoryProducts(id, mainCategory, subCategory)
 
if __name__ == "__main__":
  print randomProducts('Grocery')
  #print randomMainCategoryProducts('Grocery', 'Beverages and Drinks')
  #print categoryProducts('Grocery', 'Cereals', 'Cornflakes')
  #print newProducts('Grocery', 'Bakery', 'Cakes')
