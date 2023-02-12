const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export default asyncHandler;

// async handler takes a function and that function runs inside an async function inside which try catch is used for error handling. Due to this the function which is passed to the async function gets access of await due to closure
