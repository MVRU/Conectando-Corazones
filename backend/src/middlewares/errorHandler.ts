// Captura errores en toda la app sin necesidad de try/catch en cada controller (usar al final de los app.use())

export const errorHandler = (err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    });
};