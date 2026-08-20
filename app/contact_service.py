from app.database import contact_collection
from bson import ObjectId

def create_contact(data):
    result = contact_collection.insert_one(data)
    return str(result.inserted_id)

def get_all_contacts(page, limit, search):
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
    for contact in contact_collection.find(query).skip(skip).limit(limit):
        contact['_id'] = str(contact['_id'])
        contacts.append(contact)
    return contacts

def get_contact(contact_id, contact):
    contact = contact_collection.find_one({
    "_id":ObjectId(contact_id)})

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
