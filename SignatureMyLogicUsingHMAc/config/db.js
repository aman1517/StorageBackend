import mongoose from "mongoose";

export async function connectDb() {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/StorageApp')
        console.log("Db connected")
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}


process.on("SIGINT", async () => {
    await client.close()
    console.log("client Disconnected")
    process.exit(0)
})


