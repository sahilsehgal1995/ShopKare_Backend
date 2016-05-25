import pymongo
import json
from passlib.hash import sha256_crypt
import datetime
import os
import gc

base = 'http://www.shopkare.com/'


def MongoDBconnection(database, collection):
    connection = pymongo.MongoClient("mongodb://localhost")
    db = connection[database]
    cursor = db[collection]
    return connection, db, cursor


def registerCustomer(user):
    try:
        connection, db, collection = MongoDBconnection('Customer', 'Customers')

        print user
        if collection.find({'$or': [{"Mobile": user['Mobile']}, {"Email": user['Email']}]}).count():
            return 'User Already Exists'
        iter = collection.find()
        print iter.count()
        if not iter.count():
            user['_id'] = 'C_1'
        else:
            print iter[23]
            print iter[iter.count()-1]['_id']
            user['_id'] = 'C_' + str(iter.count()+1)
            print user
        user['Password'] = sha256_crypt.encrypt(str(user['Password']))
        print user
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
        iter = collection.find({'$or': [{"Email": user['Email']}, {"Mobile": user['Mobile']}]})
        if not iter.count():
            return "User Does't Exists", '[]'
        print iter[0]['Password']
        if sha256_crypt.verify(user['Password'], iter[0]['Password']):
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
    print cid, cartItem
    try:
        cityIndex = 0
        connection, db, collection = MongoDBconnection('Cart', cid)
        cartItem = json.loads(cartItem)
        try:
            if cartItem['$$hashKey']:
                del cartItem['$$hashKey']
                a, b, c = MongoDBconnection('Batches', cartItem['ProductID'])
                print c
                prod = c.find_one()
                print prod
                if prod:
                    quantities = prod['Quantity']
                    print quantities
                    for i in quantities:
                        print i
                        if i['qty'] == cartItem['QuantityType']:
                            print i['qty']
                            if i['value'] < cartItem['Quantity']:
                                print i['value']
                                return 'Out Of Stock'

                MainCategory = cartItem['Main Category'].replace(" ", "_")
                SubCategory = cartItem['Sub Category'].replace(" ", "_")
                product = connection[MainCategory][SubCategory].find({'_id': cartItem['ProductID']})
                QuantityType = product[0]['Quantity'][cityIndex]['Quantities'][cartItem['QuantityIndex']][0]
                cartItem['QuantityType'] = QuantityType
                cartItem['Price'] = product[0]['Quantity'][cityIndex]['Quantities'][cartItem['QuantityIndex']][1]
                connection.close()
                gc.collect()
                connection, db, collection = MongoDBconnection('Cart', cid)
                iter = collection.find({'$and': [{'ProductID': cartItem['ProductID']}, {'QuantityType': cartItem['QuantityType']}]})
                if iter.count():
                    iter = collection.update({"_id": iter[0]['_id']}, cartItem)
                    connection.close()
                    gc.collect()
                    return 'Updated in cart'
                else:
                    collection.insert(cartItem)
                connection.close()
                gc.collect()
                return 'Added to cart'
        except Exception as e:
            a, b, c = MongoDBconnection('Batches', cartItem['ProductID'])
            print c
            prod = c.find_one()
            print prod
            if prod:
                quantities = prod['Quantity']
                print '----------------------------------------------------'
                for i in quantities:
                    try:
                        if i['qty'].encode('ascii', 'ignore').decode('ascii') == cartItem['QuantityType'].encode('ascii', 'ignore').decode('ascii'):
                            print i['qty'], i['value'], type(i['value']), int(cartItem['Quantity'])
                            if int(i['value']) < int(cartItem['Quantity']):
                                print i['value']
                                return 'Out Of Stock'
                    except Exception, e:
                        print e
                        pass
            MainCategory = cartItem['Main Category'].replace(" ", "_")
            SubCategory = cartItem['Sub Category'].replace(" ", "_")
            product = connection[MainCategory][SubCategory].find({'_id': cartItem['ProductID']})
            QuantityType = product[0]['Quantity'][cityIndex]['Quantities'][cartItem['QuantityIndex']][0]
            cartItem['QuantityType'] = QuantityType
            cartItem['Price'] = product[0]['Quantity'][cityIndex]['Quantities'][cartItem['QuantityIndex']][1]
            connection.close()
            gc.collect()
            connection, db, collection = MongoDBconnection('Cart', cid)
            iter = collection.find({'$and': [{'ProductID': cartItem['ProductID']}, {'QuantityType': cartItem['QuantityType']}]})
            if iter.count():
                iter = collection.update({"_id": iter[0]['_id']}, cartItem)
                connection.close()
                gc.collect()
                return 'Updated in cart'
            else:
                collection.insert(cartItem)
            connection.close()
            gc.collect()
            return 'Added to cart'
    except Exception as e:
        return str(e)
        return 'Unable to Add to cart'


def removeFromCart(cid, cartItem):
    try:
        connection, db, collection = MongoDBconnection('Cart', cid)
        cartItem = json.loads(cartItem)
        collection.remove({'$and': [{'ProductID': cartItem['ProductID']}, {'QuantityIndex': cartItem['QuantityIndex']}]})
        connection.close()
        gc.collect()
        return 'Removed from cart'
    except Exception as e:
        print str(e)
        return 'Unable to remove from cart'


def getCartItems(cid):
    try:
        connection, db, collection = MongoDBconnection('Cart', cid)
        iter = collection.find({}, {'_id': False})
        if iter.count():
            return str(json.dumps(tuple(iter)))
        connection.close()
        gc.collect()
        return 'Your Cart is empty'
        return '[]'
    except Exception as e:
        print str(e)
        return 'Unable to get cart items'

def password_reset(data):
    connection, db, collection = MongoDBconnection('Customer', 'Customers')
    customer = collection.find({'Email': data['email']})
    if customer.count():
        return True
    return False


def reset_pass(email, data):

    connection, db, collection = MongoDBconnection('Customer', 'Customers')
    customer = collection.find({'Email': email})

    print customer[0]
    if not customer:
        return False
    customer[0]['Password'] = sha256_crypt.encrypt(str(data['password']))
    connection.close()
    return True


def OrderPlacement(cartItems, cid):
    try:
        connection, db, collection = MongoDBconnection('Order', 'Orders')
        # cartItems = json.loads(cartItems)
        iter = collection.count()
        dt = datetime.datetime.now()
        totalPrice = 0
        address = cartItems.pop('address')
        items = cartItems.pop('items')
        for i in range(0, len(items)):
            items[i]['Status'] = 'Pending'
            items[i]['OrderDate'] = dt.strftime("%A, %d. %B %Y %I:%M%p")
            items[i]['DeliveryBoy'] = []
            totalPrice += items[i]['totalPrice']
            a, b, c = MongoDBconnection('Batches', items[i]['ProductID'])
            prod = c.find_one()
            print prod
            if prod:
                quantities = prod['Quantity']
                print 1, 'ququququ'
                print '____________________________________________________'
                for j in quantities:
                    try:
                        if j['qty'].encode('ascii', 'ignore').decode('ascii') == items[i]['QuantityType'].encode('ascii', 'ignore').decode('ascii'):
                            print j['qty']
                            j['value'] = int(j['value']) - int(items[i]['Quantity'])
                            print j['value']
                            c.save(prod)
                    except Exception, e:
                        print e
                        pass
            a.close()
        collection.insert({'_id': 'O_' + str(iter + 1) + cid, 'cid': cid, 'totalPrice': totalPrice, 'items': items, 'status': 'Pending',
                           'address': json.dumps(address)})
        connection.close()
        gc.collect()
        connection, db, collection = MongoDBconnection('Admin', 'Orders')
        collection.insert({'_id': 'O_' + str(iter + 1) + cid, 'cid': cid, 'totalPrice': totalPrice, 'items': items, 'status': 'Pending',
                           'address': address})
        order = collection.find({'_id': 'O_' + str(iter + 1) + cid})
        connection, db, collection = MongoDBconnection('Customer', 'Customers')
        user = collection.find({'_id': cid})
        connection, db, collection = MongoDBconnection('Cart', cid)
        db.drop_collection(collection)
        connection.close()
        return {'order': order[0], 'email': user[0]['Email'], 'message': 'Order Placed Successfully'}
    except Exception as e:
        print 'Exception'
        print str(e)
        return 'Unable to Place'


def NewCourierOrder(cid, order):
    try:
        connection, db, collection = MongoDBconnection('Courier', cid)
        order = json.loads(order)
        order['status'] = 'Fresh'
        iter = collection.find()
        if not iter.count():
            order['_id'] = 'CO_' + '1'
        else:
            order['_id'] = 'CO_' + str(int(iter[iter.count() - 1]['_id'].split("_")[-1]) + 1)
        collection.insert(order)
        connection.close()
        gc.collect()
        connection, db, collection = MongoDBconnection('Courier', 'Orders')
        order['cid'] = cid
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
