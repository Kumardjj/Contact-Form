from app.database import contact_collection
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends

# helper fucntion
def validate_object_id(contact_id : str):
    try:
        return ObjectId(contact_id)
    except InvalidId:
        return None

# helper fucntion
def get_collection():
    return contact_collection


def create_contact(data):
    result = contact_collection.insert_one(data)
    return str(result.inserted_id)

def get_all_contacts(  page, limit, search, collection):
    skip = (page -1) * limit
    query = {}
    if search:
        query = {
            "$or": [
                {
                    "name":{
                        "$regex":search,
                        "$options":"i"
                    }
                },
                {
                    "email":{
                        "$regex": search,
                        "$options":"i"
                    }
                }
            ]
        }
    contacts = []
    for contact in collection.find(query).skip(skip).limit(limit):
        contact['_id'] = str(contact['_id'])
        contacts.append(contact)
    return contacts

def get_contact(contact_id, contact):
    try:
        obj_id = validate_object_id(contact_id)
    except InvalidId:
        raise ValueError("Invalid contact Id")
    if not obj_id:
        return None
    contact = contact_collection.find_one({
    "_id":obj_id})

    if contact:
        contact['_id'] = str(contact['_id'])
    return contact

def update_contact(contact_id,contact):
    result = contact_collection.update_one({
        "_id": ObjectId(contact_id)
    },
    {
        "$set": contact.model_dump()
    })

    return result

def delete_contact(contact_id):
    return contact_collection.delete_one({
        "_id": ObjectId(contact_id)
    })
