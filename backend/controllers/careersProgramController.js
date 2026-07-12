const {
  listAllCareersPrograms,
  getCareersProgramBySlug,
  createCareersProgram,
  updateCareersProgram,
  deleteCareersProgram,
} = require("../utils/careersProgramService");

const listPublicCareersPrograms = async (req, res) => {
  try {
    const programs = await listAllCareersPrograms({ includeInactive: false });
    res.status(200).json({ programs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const listAdminCareersPrograms = async (req, res) => {
  try {
    const programs = await listAllCareersPrograms({ includeInactive: true });
    res.status(200).json({ programs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getCareersProgram = async (req, res) => {
  try {
    const program = await getCareersProgramBySlug(req.params.slug, { includeInactive: true });
    if (!program) {
      return res.status(404).json({ message: "Careers program not found" });
    }
    res.status(200).json({ program });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createProgram = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const program = await createCareersProgram(req.body, req.user._id);
    res.status(201).json({ message: "Careers program created", program });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Failed to create program" });
  }
};

const updateProgram = async (req, res) => {
  try {
    const program = await updateCareersProgram(req.params.id, req.body, req.user._id);
    if (!program) {
      return res.status(404).json({ message: "Careers program not found" });
    }
    res.status(200).json({ message: "Careers program updated", program });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const deleted = await deleteCareersProgram(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Careers program not found" });
    }
    res.status(200).json({ message: "Careers program deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  listPublicCareersPrograms,
  listAdminCareersPrograms,
  getCareersProgram,
  createProgram,
  updateProgram,
  deleteProgram,
};
