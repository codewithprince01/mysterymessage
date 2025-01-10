import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user.models';

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Define the context type for TypeScript
interface Context {
  params: { messageid: string };
}

// DELETE Handler for removing a message by its ID
export async function DELETE(request: NextRequest, { params }: Context) {
  // Ensure params are awaited before using
  const { messageid } = await params; // Await the params object to access `messageid`

  // Validate `messageid` as a MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(messageid)) {
    return NextResponse.json(
      { success: false, message: 'Invalid message ID' },
      { status: 400 }
    );
  }

  // Connect to the database
  await dbConnect();

  // Get the session to verify the user
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Remove the message from the user's record
    const result = await UserModel.updateOne(
      { _id: session.user._id }, // Match the user
      { $pull: { messages: { _id: messageid } } } // Remove the specific message
    );

    // Check if the message was found and deleted
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Message not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting message' },
      { status: 500 }
    );
  }
}
