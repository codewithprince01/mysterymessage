import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../../auth/[...nextauth]/options';
import UserModel from '@/model/user.models';
import { NextRequest, NextResponse } from 'next/server';

// Update the type for context params
export async function DELETE(request: NextRequest, { params }: { params: { messageid: string } }) {
  const { messageid } = params;

  if (!messageid) {
    return NextResponse.json({ success: false, message: 'Message ID is missing' }, { status: 400 });
  }

  await dbConnect(); // Connect to the database

  const session = await getServerSession(authOptions); // Fetch user session
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const result = await UserModel.updateOne(
      { _id: session.user._id }, // Match the user's `_id`
      { $pull: { messages: { _id: messageid } } } // Remove the message by `_id`
    );

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
