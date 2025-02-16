const postModel = require('../models/post');

exports.getPosts = async (req, res)=> {

    const currentPage = +req.query.page;
    const pageSize = +req.query.pageSize;

    try {
        const totalPosts = await postModel.countDocuments()
        const posts = await postModel.find()
        .skip(pageSize *(currentPage - 1))
        .limit(pageSize)

        res.status(200).json({message: 'fetched data', posts, totalPosts})
    } catch (error) {
        res.status(404).send(error.message);
    }

}


exports.getPost =  async (req, res) => {

    try {
        const onepost = await postModel.findById(req.params.id);
        if(onepost) {
           return res.status(200).json({message: 'data fetched successfully', onepost})      
        }
        res.status(404).json({message: 'post not found'});

    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }

}


exports.createPost = async ( req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host');
        const post = await postModel.create({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + '/images/' + req.file.filename,
            creater: req.userData.id
        })
        res.status(201).json({
            message:'post created successfully',
            post: {
                ...post,
                id: post._id
            }
        });      
    } catch (error) {
        res.status(500).json({message:'post creation failed'});
    }

}

exports.updatePost = async (req, res) => {
    try {

       const post = await postModel.findOne({_id: req.params.id});
       
       if (!post) {
           return res.status(404).json({ message: 'Post not found' });
       }

       if (post.creater.toString() !== req.userData.id) {
           return res.status(403).json({ message: 'Not authorized to update this post' });
       }

       const url = req.protocol + '://' + req.get('host');

       let updateData = {
           title: req.body.title,
           content: req.body.content,
       }

       if (req.file) {
           updateData.imagePath = url + '/images/' + req.file.filename;
       }

       const result = await postModel.updateOne(
           { _id: req.params.id }, 
           updateData
       );

       res.status(200).json({
           message: 'Updated successfully',
           post: {
               ...updateData,
               _id: req.params.id
           }
       });
    } catch (error) {
       res.status(500).json({ message: 'Update failed', error: error.message });
    }
}


exports.deletePost = async( req, res) => {
    try {
        const result = await postModel.deleteOne({_id: req.params.id, creater: req.userData.id})

        if(result.deletedCount === 0) {
           return res.status(403).json({message: "Not authorized to delete this post"});
        }
        res.status(200).json({message: 'message deleted successfully'});
        
    } catch (error) {
        res.status(500).json({message: "Resource not found"})
    }
}
