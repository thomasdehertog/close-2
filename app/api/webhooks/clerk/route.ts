import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function handleUserCreated(data: any) {
  const { id, email_addresses, public_metadata, first_name, last_name } = data;
  const primaryEmail = email_addresses[0]?.email_address;
  const fullName = [first_name, last_name].filter(Boolean).join(' ');

  try {
    if (public_metadata?.workspaceId && public_metadata?.role) {
      // User was invited to a workspace
      await convex.mutation(api.workspaceMembers.updateMember, {
        workspaceId: public_metadata.workspaceId as string,
        userId: id,
        role: public_metadata.role as "ADMIN" | "MEMBER",
        status: "ACTIVE"
      });
      
      console.log(`Updated workspace member: ${id} in workspace ${public_metadata.workspaceId}`);
    } else {
      // New user signing up without invitation - create their workspace
      const workspaceId = await convex.mutation(api.workspaces.create, {
        name: `${fullName}'s Workspace`,
        ownerId: id
      });

      // Add them as an admin of their workspace
      await convex.mutation(api.workspaceMembers.updateMember, {
        workspaceId,
        userId: id,
        role: "ADMIN",
        status: "ACTIVE"
      });

      console.log(`Created new workspace ${workspaceId} for user ${id}`);
    }

    return true;
  } catch (error) {
    console.error('Error in handleUserCreated:', error);
    throw error;
  }
}

async function handleUserDeleted(data: any) {
  const { id } = data;
  try {
    // Deactivate all workspace memberships
    await convex.mutation(api.workspaceMembers.deactivateUserMemberships, {
      userId: id
    });

    // Archive their content (optional)
    await convex.mutation(api.documents.archiveUserContent, {
      userId: id
    });

    return true;
  } catch (error) {
    console.error('Error in handleUserDeleted:', error);
    throw error;
  }
}

async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name } = data;
  const primaryEmail = email_addresses[0]?.email_address;
  const fullName = [first_name, last_name].filter(Boolean).join(' ');

  try {
    // Update user information in workspaceMembers
    await convex.mutation(api.workspaceMembers.updateUserInfo, {
      userId: id,
      email: primaryEmail,
      name: fullName
    });

    return true;
  } catch (error) {
    console.error('Error in handleUserUpdated:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', {
      status: 400
    });
  }

  // Get the body
  let payload: any;
  try {
    payload = await req.json();
  } catch (err) {
    return new Response('Error parsing JSON body', {
      status: 400
    });
  }

  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400
    });
  }

  // Handle the webhook
  try {
    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled webhook type: ${evt.type}`);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
} 