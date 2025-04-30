import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    image: {
        type: String, // Will store Base64 encoded image string
        required: [true, 'Image is required'],
    },
    additionalInfo: {
        type: String,
    },
}, {
    timestamps: true,
});

// Check if model exists before creating to avoid OverwriteModelError in development with hot reload
const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

export default Member;
