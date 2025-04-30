import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Profile image is required'],
    },
    additionalInfo: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Member = mongoose.models.members || mongoose.model('members', memberSchema);

export default Member;
