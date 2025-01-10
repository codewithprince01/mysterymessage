import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../../auth/[...nextauth]/options';
import UserModel from '@/model/user.models';
import { User as NextAuthUser } from 'next-auth';

export async function DELETE(
  request: Request,
  context: { params: { messageid: string } }
) {
  const { messageid } = context.params; // Access the message ID from context.params

  // Connect to the database
  await dbConnect();

  // Get the server session for authentication
  const session = await getServerSession(authOptions);

  const _user = session?.user as NextAuthUser | undefined;

  // Check if the user is authenticated
  if (!_user) {
    return new Response(
      JSON.stringify({ success: false, message: 'Not authenticated' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Attempt to delete the message
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    // Check if the message was found and deleted
    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          message: 'Message not found or already deleted',
          success: false,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Respond with success if the message was deleted
    return new Response(
      JSON.stringify({ message: 'Message deleted', success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting message:', error);

    // Handle any errors that occurred during deletion
    return new Response(
      JSON.stringify({
        message: 'Error deleting message',
        success: false,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
