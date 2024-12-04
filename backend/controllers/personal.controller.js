import User from "../models/user.model.js"

export const addPersonalGoal = async (req, res) => {
    try {
      const { title, description, targetDate } = req.body;
  
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
  
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const newGoal = { title, description, targetDate };
      user.personalGoals.push(newGoal);
  
      await user.save();
  
      res.status(201).json({ message: "Goal added successfully", personalGoals: user.personalGoals });
    } catch (error) {
      console.error("Error adding personal goal:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  export const getPersonalGoals = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("personalGoals");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user.personalGoals);
    } catch (error) {
      console.error("Error retrieving personal goals:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  export const updatePersonalGoal = async (req, res) => {
    try {
      const { goalId } = req.params;
      const updates = req.body;
  
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const goal = user.personalGoals.id(goalId);
  
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
  
      Object.assign(goal, updates);
      await user.save();
  
      res.status(200).json({ message: "Goal updated successfully", personalGoals: user.personalGoals });
    } catch (error) {
      console.error("Error updating personal goal:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
 
export const deletePersonalGoal = async (req, res) => {
  const goalId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and remove the goal from the user's personalGoals array
    const goalIndex = user.personalGoals.findIndex(goal => goal._id.toString() === goalId);

    if (goalIndex === -1) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Remove the goal from the array
    user.personalGoals.splice(goalIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Goal deleted successfully", personalGoals: user.personalGoals });
  } catch (error) {
    console.error("Error deleting personal goal:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
  
  