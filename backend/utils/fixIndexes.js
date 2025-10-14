const mongoose = require("mongoose");

async function fixUserIndexes() {
    try {
        const db = mongoose.connection.db;
        const collection = db.collection("users");
        const indexes = await collection.indexes();
        const hasUsernameUnique = indexes.some(idx => idx.name === "username_1");
        if (hasUsernameUnique) {
            try {
                await collection.dropIndex("username_1");
                console.log("Dropped stale index: username_1");
            } catch (err) {
                // If index doesn't exist or cannot be dropped, log and continue
                console.warn("Could not drop index username_1:", err.message);
            }
        }
    } catch (err) {
        console.warn("Index inspection failed:", err.message);
    }
}

module.exports = { fixUserIndexes };



