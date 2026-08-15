const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // Multer file upload errors
    if (err.name === "MulterError") {
      if (err.code === "LIMIT_FILE_SIZE") {
        error = new Error("File too large. Maximum size is 2MB");
        error.statusCode = 400;
      } else {
        error = new Error("File upload error");
        error.statusCode = 400;
      }
    }

    // Prisma unique constraint violation (duplicate)
    if (err.code === "P2002") {
      // P2002 = unique constraint failed
      const targetField = err.meta?.target ? err.meta.target.join(', ') : 'field';
      error = new Error(`Duplicate value entered for ${targetField}`);
      error.statusCode = 400;
    }

    // Prisma record not found (not always thrown automatically, depends on `findUniqueOrThrow`)
    if (err.code === "P2025") {
      error = new Error("Resource not found");
      error.statusCode = 404;
    }

    // Other Prisma errors (optional)
    // e.g., validation / type errors
    if (err.name === "ValidationError") {
      error = new Error(err.message);
      error.statusCode = 400;
    }

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });

  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;