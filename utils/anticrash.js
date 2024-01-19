// Listen for unhandled Promise rejections
process.on("unhandledRejection", (reason, p) => {
    // Log details of unhandled rejection
    console.error("Unhandled Rejection at:", p, "\nReason:", reason);
});

// Listen for uncaught exceptions
process.on("uncaughtException", (err, origin) => {
    // Log details of uncaught exception
    console.error("Uncaught Exception:", err, "\nOrigin:", origin);
});
