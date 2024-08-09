import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  // Substitua com os dados da sua aplicação Appwrite
  endpoint: "https://example.com/v1",
  platform: "com.example.app",
  projectId: "example123",
  databaseId: "example456",
  userCollectionId: "example789",
  videoCollectionId: "example012",
  storageId: "example345",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) 
  .setProject(appwriteConfig.projectId) 
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (user: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );

    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.username);
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username: user.username,
        email: user.email,
        avatar: avatarUrl,
      }
    );
    await signIn(user.email, user.password);
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(
      email.trim(),
      password
    );
    if (!session) throw Error;
    return session;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAcount = await account.get();
    if (!currentAcount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAcount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    const session = await account.getSession("current");
    if (!session) throw Error;
    await account.deleteSession("current");
  } catch (error) {
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );
    return posts;
  } catch (error) {
    throw error;
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );
    return posts;
  } catch (error) {
    throw error;
  }
};

export const getBookmarkedPosts = async (query?: any) => {
  try {
    const currentUser = await getCurrentUser();
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.contains("saved_by", currentUser.$id)]
    );

    if (query) {
      const filteredPosts = posts.documents.filter((post) => post.title.includes(query));
      return {
        documents: filteredPosts,
      };
    }

    return posts;
  } catch (error) {
    throw error;
  }
}


export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );
    return posts;
  } catch (error) {
    throw error;
  }
};

export const searchPostsByUser = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );
    return posts;
  } catch (error) {
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      postId
    );
    return post;
  } catch (error) {
    throw error;
  }
};

export const addBookmark = async (postId) => {
  try {
    // Fetch current user and post details in parallel
    const [user, post] = await Promise.all([getCurrentUser(), getPostById(postId)]);

    // Check if user and post exist
    if (!user) throw new Error('User not found');
    if (!post) throw new Error('Post not found');

    // Check if the post is already saved by the user

    // Update the post's saved_by array
    if (!post.saved_by.includes(user.$id)) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        postId,
        {
          saved_by: [...post.saved_by, user.$id],
        }
      );
    }

    // Update the user's savedPosts array
    if (!user.savedPosts.includes(postId)) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id,
        {
          savedPosts: [...user.savedPosts, postId],
        }
      );
    }

  } catch (error) {
    console.error('Failed to add bookmark:', error.message);
    throw new Error(`Failed to add bookmark: ${error.message}`);
  }
};


export const removeBookmark = async (postId) => {
  try {
    // Fetch current user and post details in parallel
    const [user, post] = await Promise.all([getCurrentUser(), getPostById(postId)]);

    // Check if user and post exist
    if (!user) throw new Error('User not found');
    if (!post) throw new Error('Post not found');

    // Check if the post is already saved by the user

    // Update the post's saved_by array
    if (post.saved_by.includes(user.$id)) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        postId,
        {
          saved_by: post.saved_by.filter((id) => id !== user.$id),
        }
      );
    }

    // Update the user's savedPosts array
    if (user.savedPosts.includes(postId)) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id,
        {
          savedPosts: user.savedPosts.filter((id) => id !== postId),
        }
      );
    }

  } catch (error) {
    console.error('Failed to remove bookmark:', error.message);
    throw new Error(`Failed to remove bookmark: ${error.message}`);
  }
};


// Storage
export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = await storage.getFilePreview(appwriteConfig.storageId, fileId);
    } else if (type === "video") {
      fileUrl = await storage.getFileView(appwriteConfig.storageId, fileId);
    } else {
      throw new Error("Arquivo inválido");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file, fileType) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    uri: file.uri,
    size: file.fileSize,
  };

  try {
    const uniqueId = ID.unique();
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      uniqueId,
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, fileType);
    return fileUrl;
  } catch (error) {
    throw error;
  }
};

export const createVideo = async (data) => {
  try {
    const [thumbnailURL, videoURL] = await Promise.all([
      uploadFile(data.thumbnail, "image"),
      uploadFile(data.video, "video"),
    ]);

    if (!thumbnailURL || !videoURL) throw Error;

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: data.title,
        thumbnail: thumbnailURL,
        video: videoURL,
        prompt: data.prompt,
        creator: data.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw error;
  }
};
