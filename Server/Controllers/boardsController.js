import BoardsModel from "../Database/boardsModel.js";

// @desc    Get all boards
// @route   GET /admin/boards
export const getBoards = async (req, res) => {
  try {
    const boards = await BoardsModel.find().sort({ CreatedAt: -1 });
    res.status(200).json({ boards });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch boards", error });
  }
};

// @desc    Create a new board
// @route   POST /admin/boards/create
export const createBoard = async (req, res) => {
  try {
    const { Type, Location, Latitude, Longitude, Height, Width, City } = req.body;

    const existing = await BoardsModel.findOne({ Location });
    if (existing) {
      return res.status(400).json({ message: "Board with this location already exists." });
    }

    const newBoard = new BoardsModel({
      Type,
      Location,
      Latitude,
      Longitude,
      Height,
      Width,
      City,
    });

    await newBoard.save();
    res.status(201).json({ message: "Board created successfully", board: newBoard });
  } catch (error) {
    res.status(500).json({ message: "Failed to create board", error });
  }
};

// @desc    Update an existing board
// @route   PUT /admin/boards/:id
export const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { Type, Location, Latitude, Longitude, Height, Width, City } = req.body;

    const board = await BoardsModel.findById(id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    board.Type = Type;
    board.Location = Location;
    board.Latitude = Latitude;
    board.Longitude = Longitude;
    board.Height = Height;
    board.Width = Width;
    board.City = City;
    board.UpdatedAt = new Date();

    const updatedBoard = await board.save();
    res.status(200).json({ message: "Board updated successfully", board: updatedBoard });
  } catch (error) {
    res.status(500).json({ message: "Failed to update board", error });
  }
};

// @desc    Delete a board
// @route   DELETE /admin/boards/:id
export const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBoard = await BoardsModel.findByIdAndDelete(id);

    if (!deletedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete board", error });
  }
};
