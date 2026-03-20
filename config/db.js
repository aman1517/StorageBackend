import mongoose from "mongoose";

export async function connectDb() {

    try {
        await mongoose.connect(process.env.MONGODB_URI)
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


