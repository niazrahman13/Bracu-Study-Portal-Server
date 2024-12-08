import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role?: string;
  friends: string[]; // Array of friend user IDs
  friendRequests: string[]; // Array of friend request IDs
  groups: string[]; // Array of group IDs
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: '' },
    role: { type: String, default: 'user' },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }]
  },
  { timestamps: true }
);


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next(); // Skip if password is not modified or empty

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
