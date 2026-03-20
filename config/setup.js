import { connectDb, client } from "./db.js";

const db = await connectDb()
const command = "collMod"  //create //collMod

await db.command({
    [command]: 'users',
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'email',
                'name',
                'password',
                'rootID'
            ],
            properties: {
                _id: {
                    bsonType: 'objectId'
                },
                email: {
                    bsonType: 'string',
                    pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
                    description:"Please check the email "
                },
                name: {
                    bsonType: 'string',
                    minLength:2,
                    description:"Name  must be grater than 2 char "
                },
                password: {
                    bsonType: 'string',
                    minLength:4,
                    description:"password  must be grater than 4 char "
                },
                rootID: {
                    bsonType: 'objectId'
                }
            }
        }
    },
    validationAction:"error",
    validationLevel:"strict"

})


await db.command({
    [command]: 'dir',
    validator: {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'name',
      'parentDir',
      'userId'
    ],
    properties: {
      _id: {
        bsonType: 'objectId'
      },
      name: {
        bsonType: 'string',
        
        description:"Please check the name "
      },
      parentDir: {
        bsonType: 'null'
      },
      userId: {
        bsonType: 'objectId'
      }
    }
  }
},
    validationAction:"error",
    validationLevel:"strict"

})


await db.command({
    [command]: 'filedata',
    validator: {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      '_id',
      'extention',
      'name',
      'parentDirID'
    ],
    properties: {
      _id: {
        bsonType: 'objectId'
      },
      extention: {
        bsonType: 'string'
      },
      name: {
        bsonType: 'string',
         description:"Please check the name "
      },
      parentDirID: {
        bsonType: 'objectId'
      }
    }
  }
},
    validationAction:"error",
    validationLevel:"strict"

})

client.close()
