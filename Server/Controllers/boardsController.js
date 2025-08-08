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
    const { BoardNo, Type, Location, Latitude, Longitude, Height, Width, City } = req.body;

    // Check if BoardNo already exists
    const existingBoardNo = await BoardsModel.findOne({ BoardNo });
    if (existingBoardNo) {
      return res.status(400).json({ message: "Board with this BoardNo already exists." });
    }

    // Check if Location already exists
    const existingLocation = await BoardsModel.findOne({ Location });
    if (existingLocation) {
      return res.status(400).json({ message: "Board with this location already exists." });
    }

    const newBoard = new BoardsModel({
      BoardNo,
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
    const { BoardNo, Type, Location, Latitude, Longitude, Height, Width, City } = req.body;

    const board = await BoardsModel.findById(id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Ensure BoardNo is unique if changed
    if (BoardNo && BoardNo !== board.BoardNo) {
      const existingBoardNo = await BoardsModel.findOne({ BoardNo });
      if (existingBoardNo) {
        return res.status(400).json({ message: "Board with this BoardNo already exists." });
      }
      board.BoardNo = BoardNo;
    }

    // Ensure Location is unique if changed
    if (Location && Location !== board.Location) {
      const existingLocation = await BoardsModel.findOne({ Location });
      if (existingLocation) {
        return res.status(400).json({ message: "Board with this location already exists." });
      }
      board.Location = Location;
    }

    board.Type = Type;
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
