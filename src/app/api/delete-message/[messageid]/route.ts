import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../../auth/[...nextauth]/options';
import UserModel from '@/model/user.models';
import { User as NextAuthUser } from 'next-auth';


// hehehe
export async function DELETE(
  request: Request,
  context: { params: { messageid: string } }
) {
  const { messageid } = context.params; // Access params directly without `await`

  await dbConnect();
  const session = await getServerSession(authOptions);

  const _user = session?.user as NextAuthUser | undefined;

  if (!_user) {
    return new Response(
      JSON.stringify({ success: false, message: 'Not authenticated' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          message: 'Message not found or already deleted',
          success: false,
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Message deleted', success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(
      JSON.stringify({ message: 'Error deleting message', success: false }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
