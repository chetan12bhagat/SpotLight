# Spotlight API Documentation

## Service Modules Overview

All service modules are located in `src/services/` and provide a clean interface to interact with Supabase.

---

## Authentication Service (`authService.js`)

### `signUp(email, password, userData)`
Create a new user account.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password (min 6 characters)
- `userData` (object): Additional user data
  - `full_name` (string): User's full name
  - `avatar_url` (string, optional): Avatar URL

**Returns:** `{ data, error }`

**Example:**
\`\`\`javascript
const { data, error } = await authService.signUp(
  'user@example.com',
  'password123',
  { full_name: 'John Doe' }
)
\`\`\`

### `signIn(email, password)`
Sign in existing user.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password

**Returns:** `{ data, error }`

### `signOut()`
Sign out current user.

**Returns:** `{ error }`

### `resetPassword(email)`
Send password reset email.

**Parameters:**
- `email` (string): User's email

**Returns:** `{ error }`

### `getCurrentUser()`
Get currently authenticated user.

**Returns:** `{ user, error }`

---

## User Service (`userService.js`)

### `getUserProfile(userId)`
Get user profile by ID.

**Parameters:**
- `userId` (string): User's UUID

**Returns:** `{ data, error }`

### `updateUserProfile(userId, updates)`
Update user profile.

**Parameters:**
- `userId` (string): User's UUID
- `updates` (object): Fields to update

**Returns:** `{ data, error }`

**Example:**
\`\`\`javascript
const { data, error } = await userService.updateUserProfile(userId, {
  full_name: 'Jane Doe',
  bio: 'Content creator'
})
\`\`\`

### `getUserSubscriptions(userId)`
Get user's active subscriptions.

**Parameters:**
- `userId` (string): User's UUID

**Returns:** `{ data, error }`

### `getUserNotifications(userId, limit)`
Get user's notifications.

**Parameters:**
- `userId` (string): User's UUID
- `limit` (number, default: 20): Max notifications to return

**Returns:** `{ data, error }`

---

## Creator Service (`creatorService.js`)

### `createCreatorProfile(creatorData)`
Create a new creator profile.

**Parameters:**
- `creatorData` (object):
  - `user_id` (string): User's UUID
  - `display_name` (string): Creator display name
  - `bio` (string): Creator bio
  - `subscription_price` (number): Monthly price

**Returns:** `{ data, error }`

### `getCreatorProfile(creatorId)`
Get creator profile by ID.

**Parameters:**
- `creatorId` (string): Creator's UUID

**Returns:** `{ data, error }`

### `updateCreatorProfile(creatorId, updates)`
Update creator profile.

**Parameters:**
- `creatorId` (string): Creator's UUID
- `updates` (object): Fields to update

**Returns:** `{ data, error }`

### `uploadAvatar(file, creatorId)`
Upload creator avatar image.

**Parameters:**
- `file` (File): Image file
- `creatorId` (string): Creator's UUID

**Returns:** `{ path, error }`

### `getAllCreators(limit, offset)`
Get all verified creators.

**Parameters:**
- `limit` (number, default: 20): Results per page
- `offset` (number, default: 0): Pagination offset

**Returns:** `{ data, error }`

### `searchCreators(query)`
Search creators by name or bio.

**Parameters:**
- `query` (string): Search query

**Returns:** `{ data, error }`

---

## Post Service (`postService.js`)

### `createPost(postData)`
Create a new post.

**Parameters:**
- `postData` (object):
  - `creator_id` (string): Creator's UUID
  - `caption` (string): Post caption
  - `content_url` (string): Media file path
  - `content_type` (string): 'image' or 'video'
  - `status` (string): 'draft', 'pending', 'approved', 'rejected'

**Returns:** `{ data, error }`

### `uploadPostMedia(file, creatorId)`
Upload post media file.

**Parameters:**
- `file` (File): Image or video file
- `creatorId` (string): Creator's UUID

**Returns:** `{ path, error }`

### `getPostMediaUrl(path)`
Get signed URL for post media.

**Parameters:**
- `path` (string): File path in storage

**Returns:** `signedUrl` (string)

### `getPostsFeed(limit, offset)`
Get approved posts feed.

**Parameters:**
- `limit` (number, default: 20): Posts per page
- `offset` (number, default: 0): Pagination offset

**Returns:** `{ data, error }`

### `getCreatorPosts(creatorId, includeAll)`
Get posts by creator.

**Parameters:**
- `creatorId` (string): Creator's UUID
- `includeAll` (boolean, default: false): Include non-approved posts

**Returns:** `{ data, error }`

### `updatePost(postId, updates)`
Update post.

**Parameters:**
- `postId` (string): Post UUID
- `updates` (object): Fields to update

**Returns:** `{ data, error }`

### `deletePost(postId)`
Delete post.

**Parameters:**
- `postId` (string): Post UUID

**Returns:** `{ error }`

---

## Subscription Service (`subscriptionService.js`)

### `createSubscription(subscriptionData)`
Create a new subscription.

**Parameters:**
- `subscriptionData` (object):
  - `subscriber_id` (string): Subscriber's UUID
  - `creator_id` (string): Creator's UUID
  - `stripe_subscription_id` (string): Stripe subscription ID
  - `status` (string): Subscription status

**Returns:** `{ data, error }`

### `getUserSubscriptions(userId)`
Get user's active subscriptions.

**Parameters:**
- `userId` (string): User's UUID

**Returns:** `{ data, error }`

### `getCreatorSubscribers(creatorId)`
Get creator's subscribers.

**Parameters:**
- `creatorId` (string): Creator's UUID

**Returns:** `{ data, error }`

### `cancelSubscription(subscriptionId)`
Cancel a subscription.

**Parameters:**
- `subscriptionId` (string): Subscription UUID

**Returns:** `{ data, error }`

### `createCheckoutSession(creatorId, priceId)`
Create Stripe checkout session.

**Parameters:**
- `creatorId` (string): Creator's UUID
- `priceId` (string): Stripe price ID

**Returns:** `{ data, error }`

---

## Message Service (`messageService.js`)

### `sendMessage(messageData)`
Send a message.

**Parameters:**
- `messageData` (object):
  - `sender_id` (string): Sender's UUID
  - `receiver_id` (string): Receiver's UUID
  - `content` (string): Message content
  - `media_url` (string, optional): Media URL

**Returns:** `{ data, error }`

### `getConversationMessages(userId, otherUserId, limit)`
Get messages in a conversation.

**Parameters:**
- `userId` (string): Current user's UUID
- `otherUserId` (string): Other user's UUID
- `limit` (number, default: 50): Max messages

**Returns:** `{ data, error }`

### `getUserConversations(userId)`
Get user's conversations.

**Parameters:**
- `userId` (string): User's UUID

**Returns:** `{ data, error }`

### `subscribeToMessages(userId, callback)`
Subscribe to real-time messages.

**Parameters:**
- `userId` (string): User's UUID
- `callback` (function): Callback for new messages

**Returns:** Subscription object

**Example:**
\`\`\`javascript
const subscription = messageService.subscribeToMessages(userId, (payload) => {
  console.log('New message:', payload.new)
})

// Unsubscribe when done
subscription.unsubscribe()
\`\`\`

---

## Moderation Service (`moderationService.js`)

### `getPendingPosts(limit, offset)`
Get posts pending moderation.

**Parameters:**
- `limit` (number, default: 20): Posts per page
- `offset` (number, default: 0): Pagination offset

**Returns:** `{ data, error }`

### `approvePost(postId, moderatorId)`
Approve a post.

**Parameters:**
- `postId` (string): Post UUID
- `moderatorId` (string): Moderator's UUID

**Returns:** `{ data, error }`

### `rejectPost(postId, moderatorId, reason)`
Reject a post.

**Parameters:**
- `postId` (string): Post UUID
- `moderatorId` (string): Moderator's UUID
- `reason` (string, optional): Rejection reason

**Returns:** `{ data, error }`

### `verifyCreator(creatorId, moderatorId)`
Verify a creator.

**Parameters:**
- `creatorId` (string): Creator's UUID
- `moderatorId` (string): Moderator's UUID

**Returns:** `{ data, error }`

### `autoModeratePost(postId)`
Trigger auto-moderation for a post.

**Parameters:**
- `postId` (string): Post UUID

**Returns:** `{ data, error }`

---

## Database Schema

### Tables

#### users
- `id` (UUID, PK): User ID (references auth.users)
- `email` (TEXT): User email
- `full_name` (TEXT): Full name
- `avatar_url` (TEXT): Avatar URL
- `bio` (TEXT): User bio
- `is_creator` (BOOLEAN): Creator flag
- `is_admin` (BOOLEAN): Admin flag
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Update timestamp

#### creators
- `id` (UUID, PK): Creator ID
- `user_id` (UUID, FK): References users.id
- `display_name` (TEXT): Display name
- `bio` (TEXT): Bio
- `avatar_url` (TEXT): Avatar URL
- `banner_url` (TEXT): Banner URL
- `subscription_price` (DECIMAL): Monthly price
- `verified` (BOOLEAN): Verification status
- `subscriber_count` (INTEGER): Subscriber count
- `post_count` (INTEGER): Post count

#### posts
- `id` (UUID, PK): Post ID
- `creator_id` (UUID, FK): References creators.id
- `caption` (TEXT): Post caption
- `content_url` (TEXT): Media URL
- `content_type` (TEXT): 'image' or 'video'
- `status` (TEXT): 'draft', 'pending', 'approved', 'rejected'
- `likes_count` (INTEGER): Like count
- `comments_count` (INTEGER): Comment count

#### subscriptions
- `id` (UUID, PK): Subscription ID
- `subscriber_id` (UUID, FK): References users.id
- `creator_id` (UUID, FK): References creators.id
- `stripe_subscription_id` (TEXT): Stripe ID
- `status` (TEXT): 'active', 'cancelled', 'expired', 'past_due'

#### messages
- `id` (UUID, PK): Message ID
- `sender_id` (UUID, FK): References users.id
- `receiver_id` (UUID, FK): References users.id
- `content` (TEXT): Message content
- `media_url` (TEXT): Media URL
- `read` (BOOLEAN): Read status

---

## Edge Functions

### moderatePost
Auto-moderate post content using AI.

**Endpoint:** `POST /functions/v1/moderatePost`

**Body:**
\`\`\`json
{
  "postId": "uuid"
}
\`\`\`

### createCheckoutSession
Create Stripe checkout session for subscription.

**Endpoint:** `POST /functions/v1/createCheckoutSession`

**Body:**
\`\`\`json
{
  "creatorId": "uuid",
  "priceId": "price_xxx"
}
\`\`\`

### stripeWebhook
Handle Stripe webhook events.

**Endpoint:** `POST /functions/v1/stripeWebhook`

**Headers:**
- `stripe-signature`: Webhook signature

---

## Error Handling

All service methods return `{ data, error }` or `{ error }`.

**Example:**
\`\`\`javascript
const { data, error } = await postService.createPost(postData)

if (error) {
  console.error('Error creating post:', error)
  // Handle error
} else {
  console.log('Post created:', data)
  // Handle success
}
\`\`\`

---

**Last Updated**: 2025-11-23
**Version**: 1.0.0
