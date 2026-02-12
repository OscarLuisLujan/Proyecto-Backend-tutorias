const validate = (schema, property = 'body') => (req, res, next) => {
  try {
    // 1. Verificar que la propiedad existe en req
    if (req[property] === undefined) {
      return res.status(400).json({
        errors: [{
          campo: property,
          mensaje: `La propiedad '${property}' no está presente en la solicitud`,
        }],
      });
    }

    // 2. Validar con Zod
    const validatedData = schema.parse(req[property]);
    
    // 3. Opcional: Guardar datos validados en req para uso posterior
    req.validatedData = validatedData;
    
    next();
  } catch (error) {
    // 4. Manejo seguro de errores de Zod
    if (error.errors && Array.isArray(error.errors)) {
      return res.status(400).json({
        errors: error.errors.map(e => ({
          campo: e.path && e.path.length > 0 
            ? e.path.join('.') 
            : 'general',
          mensaje: e.message || 'Error de validación',
          codigo: e.code || 'invalid_type', // código de error de Zod
        })),
        mensaje: 'Error de validación en los datos enviados',
      });
    }
    
    // 5. Manejo de otros tipos de errores
    return res.status(400).json({
      errors: [{
        campo: 'general',
        mensaje: 'Error de validación inesperado',
        detalle: process.env.NODE_ENV === 'development' 
          ? error.message 
          : undefined,
      }],
    });
  }
};

module.exports = validate;