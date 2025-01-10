import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../../auth/[...nextauth]/options';
import UserModel from '@/model/user.models';
import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: { messageid: string };
}

export async function DELETE(request: NextRequest, context: Context) {
  const { messageid } = context.params; // Correctly extract the `messageid`

  // Validate the message ID
  if (!messageid) {
    return NextResponse.json(
      { success: false, message: 'Message ID is missing' },
      { status: 400 }
    );
  }

  // Establish a connection to the database
  await dbConnect();

  // Authenticate the user
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Perform the deletion
    const updateResult = await UserModel.updateOne(
      { _id: session.user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
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
