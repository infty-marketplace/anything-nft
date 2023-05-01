import pymongo

mongoose = pymongo.MongoClient(
    "mongodb+srv://admin:admin@cluster0.q6hzh.mongodb.net/infty")
db = mongoose.infty

users = db.users
users.delete_many(
    {"address": 'cfxtest:aasr3dg9d0ej0cb5x720yj4651rsjcr0ap640rxmce'})

# nfts = db.nfts
# nfts.delete_many(
#     {"author": 'cfxtest:aasr3dg9d0ej0cb5x720yj4651rsjcr0ap640rxmce'})
