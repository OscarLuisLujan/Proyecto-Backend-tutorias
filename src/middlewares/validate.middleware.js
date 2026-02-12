const validate = (schema, property = 'body') => (req, res, next) => {
  try {
    
    if (req[property] === undefined) {
      return res.status(400).json({
        errors: [{
          campo: property,
          mensaje: `La propiedad '${property}' no está presente en la solicitud`,
        }],
      });
    }

    
    const validatedData = schema.parse(req[property]);
    
    
    req.validatedData = validatedData;
    
    next();
  } catch (error) {
    
    if (error.errors && Array.isArray(error.errors)) {
      return res.status(400).json({
        errors: error.errors.map(e => ({
          campo: e.path && e.path.length > 0 
            ? e.path.join('.') 
            : 'general',
          mensaje: e.message || 'Error de validación',
          codigo: e.code || 'invalid_type', 
        })),
        mensaje: 'Error de validación en los datos enviados',
      });
    }
    
    
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