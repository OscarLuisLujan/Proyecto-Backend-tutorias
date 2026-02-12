const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido'),
});

const registerUserSchema = z.object({
  nombre: z.string().min(2, 'Nombre muy corto'),
  apellido: z.string().min(2, 'Apellido muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const updateUserSchema = z.object({
  nombre: z.string().min(2).optional(),
  apellido: z.string().min(2).optional(),
  email: z.string().email().optional(),
}).refine(
  data => Object.keys(data).length > 0,
  { message: 'Debe enviar al menos un campo para actualizar' }
);

module.exports = {
  idParamSchema,
  registerUserSchema,
  updateUserSchema,
};
