import Todo from "../models/todo.js";

export const createTodo = async (req, res) => {
  try {
    const id = req.user.id;
    const todo = await Todo.create({
      title: req.body.title,
      status: "new",
      user: id,
    });
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error,
    });
  }
};

export const editTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findById(id);

    if (req.user.role !== "admin" && todo.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Access denied: Not your todo" });
    }
    await Todo.updateMany(
      { _id: id },
      {
        $set: req.body,
        updateAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error,
    });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error,
    });
  }
};

export const getUserTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error,
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    if (req.user.role !== "admin" && todo.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Access denied: Not your todo" });
    }
    await todo.deleteOne();
    res.status(200).json({ message: "Todo deleted successfully", todo: todo });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error,
    });
  }
};
