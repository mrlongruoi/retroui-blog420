import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

export const ConnectDB = async () => {
    if (!MONGODB_URL) {
        throw new Error('MONGODB_URL environment variable is not defined');
    }

    // If already connected, reuse the existing connection
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        // Use recommended options and let mongoose manage the connection pool
        await mongoose.connect(MONGODB_URL, {
            // keep default options minimal to avoid warnings
            // you can add useNewUrlParser/useUnifiedTopology if needed by your mongoose version
        });
        console.log('DB Connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
    }
};