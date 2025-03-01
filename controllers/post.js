import Post from "../models/Post.js";
import logger from "../logger.js";
import { postJoi } from "../Joi/postJoi.js";

export const handleCreatePost = async (req, res) => {
  const { error } = postJoi.validate(req.body);
  if (error) {
    logger.warn(`Post failed: ${error.details[0].message}`);
    return res.status(400).json({ msg: error.details[0].message });
  }

  const { userId, postName, description, uploadTime, tags, imageUrl } =
    req.body;

  try {
    if (req.user.id !== userId) {
      logger.warn(`Unauthorized post creation ${req.user.email}`);
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const newPost = new Post({
      userId,
      postName,
      description,
      uploadTime,
      tags,
      imageUrl,
    });

    await newPost.save();

    logger.info(`Post created by user ${req.user.email}: ${postName}`);

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    logger.error(`Post failed: ${error.message}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


export const handleFetchPosts = async (req, res) => {
     try {
       const { searchText, tags, page = 1, limit = 10 } = req.query;
   
       let filter = {};
     
       if (searchText) {
         filter.$or = [
           { postName: { $regex: searchText, $options: "i" } },
           { description: { $regex: searchText, $options: "i" } },
         ];
       }


       if (tags) {
         const tagArray = Array.isArray(tags) ? tags : tags.split(",");
         filter.tags = { $in: tagArray };
       }
   
       const skip = (parseInt(page) - 1) * parseInt(limit);
   
       const posts = await Post.find(filter)
         .skip(skip)
         .limit(parseInt(limit))
         .sort({ uploadTime: -1 }); 
   
       const totalPosts = await Post.countDocuments(filter);
   
       logger.info(`Posts fetched successfully: ${posts.length} results`);
       
       res.status(200).json({
         message: "Posts fetched successfully",
         totalPosts,
         currentPage: parseInt(page),
         totalPages: Math.ceil(totalPosts / parseInt(limit)),
         posts,
       });
     } catch (error) {
       logger.error(`Error fetching posts: ${error.message}`);
       res.status(500).json({ msg: "Internal Server Error" });
     }
   };