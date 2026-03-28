import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req,res){
    try{
        const currentUserId= req.user.id;
        const currentUser = req.user
        
       const recommendedUsers = await User.find({
      _id: { $ne: currentUserId, $nin: currentUser.friends }, // exclude self + friends
      isOnboarded: true,
    }); 
        res.status(200).json({success:true,recommendedUsers});
    }
    catch(error){
        console.error("Error in getRecommendedUsers controller:", error);
        res.status(500).json({ message: "Internal Server Error" }); 

    }
}





export async function getMyFriends(req,res){
    try{
        const user=await User.findById(req.user.id)
        .select("friends")
            .populate("friends", "fullName profilePicture nativeLanguage learningLanguage location bio");
            res.status(200).json({friends:user.friends});
    }
    catch(error){
        console.error("Error in getMyFriends controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }   
}


export async function sendFriendRequest(req,res){
    try{
    const myId=req.user.id;
    const {id:friendId}=req.params; // Extract friendId from params

    if(myId===friendId){
        return res.status(400).json({message:"You cannot send a friend request to yourself"});
    }   

    const recipient=await User.findById(friendId);
    if(!recipient){
        return res.status(404).json({message:"User not found"});
    }

    if(recipient.friends.includes(myId)){
        return res.status(400).json({message:"You are already friends with this user"});
    }   

    //check if a friend request already exists

    const existingRequest=await FriendRequest.findOne({
      $or:[
        {sender:myId,recipient:friendId},
        {sender:friendId,recipient:myId}    
      ]
    });

    if(existingRequest){
        return res.status(400).json({message:"Friend request already exists"});
    }   

    
   const friendRequest=await FriendRequest.create({
        sender:myId,    
        recipient:friendId
    });
    res.status(201).json({friendRequest});
}
catch(error){
        console.error("Error in sendFriendRequest controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }   
}



export async function acceptFriendRequest(req,res){
    try{
        const { id:requestId } = req.params; // Extract requestId from params

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {   
            return res.status(404).json({ message: "Friend request not found" });
        }

        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each other as friends
        const sender = await User.findById(friendRequest.sender);
        const recipient = await User.findById(friendRequest.recipient);

        if (!sender || !recipient) {
            return res.status(404).json({ message: "User could not be found" });
        }

        if (!sender.friends.includes(recipient._id)) {
            sender.friends.push(recipient._id);
            await sender.save();
        }

        if (!recipient.friends.includes(sender._id)) {
            recipient.friends.push(sender._id);
            await recipient.save();
        }

        res.status(200).json({ message: "Friend request accepted successfully" });  

    }

    catch(error){
        console.error("Error in acceptFriendRequest controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function declineFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to decline this friend request" });
    }

    friendRequest.status = "declined";
    await friendRequest.save();

    res.status(200).json({ message: "Friend request declined successfully" });
  } catch (error) {
    console.error("Error in declineFriendRequest controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function clearAcceptedRequest(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await FriendRequest.findOne({
      _id: id,
      status: "accepted",
      $or: [{ sender: userId }, { recipient: userId }],
    });

    if (!existing) {
      return res.status(404).json({ message: "Accepted notification not found" });
    }

    await FriendRequest.findByIdAndDelete(id);

    res.status(200).json({ message: "Notification cleared" });
  } catch (error) {
    console.error("Error in clearAcceptedRequest controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function clearAllAcceptedRequests(req, res) {
  try {
    const userId = req.user.id;

    await FriendRequest.deleteMany({
      status: "accepted",
      $or: [{ sender: userId }, { recipient: userId }],
    });

    res.status(200).json({ message: "All accepted notifications cleared" });
  } catch (error) {
    console.error("Error in clearAllAcceptedRequests controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// export async function getFriendRequests(req,res){
//     try{
//         const incomingRequests=await FriendRequest.find({
//             recipient:req.user.id,
//             status:"pending"
//         }).populate("sender","fullName profilePicture nativeLanguage learningLanguage");   


//         // const acceptedRequests=await FriendRequest.find({
//         //     recipient:req.user.id,
//         //     status:"accepted"
//         // }).populate("recipient","fullName profilePicture");    

//   const acceptedRequests = await FriendRequest.find({
//     recipient: req.user.id,
//     status: "accepted"
// })
// .populate("sender", "fullName profilePicture");  // <--- populate sender instead of recipient


//         res.status(200).json({incomingRequests,acceptedRequests})
//     }

//     catch(error){

//         console.error("Error in getFriendRequests controller:", error);
//         res.status(500).json({ message: "Internal Server Error" }); 
//     }
// }


export async function getFriendRequests(req, res) {
  try {
    const userId = req.user.id;

    // incoming pending requests
    const incomingRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "fullName profilePicture nativeLanguage learningLanguage");

    // accepted requests where I am the recipient
    const acceptedAsRecipient = await FriendRequest.find({
      recipient: userId,
      status: "accepted",
    }).populate("sender", "fullName profilePicture");

    // accepted requests where I am the sender
    const acceptedAsSender = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    }).populate("recipient", "fullName profilePicture");

    // merge both types
    const acceptedRequests = [
      ...acceptedAsRecipient.map(req => ({
        _id: req._id,
        user: req.sender,          // show sender
        type: "recipient",         // I accepted
      })),
      ...acceptedAsSender.map(req => ({
        _id: req._id,
        user: req.recipient,       // show recipient
        type: "sender",            // they accepted
      })),
    ];

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.error("Error in getFriendRequests controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}