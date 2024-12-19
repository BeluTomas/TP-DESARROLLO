import token from '../services/token';

// Función reutilizable que recibe los roles permitidos
const createAuth = (rolesPermitidos) => {
    return async (req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'NO SE ENVIO EL TOKEN'
            });
        }

        const response = await token.decode(req.headers.token);

        if (response) {
            if (rolesPermitidos.includes(response.rol)) {
                next(); // Permite el acceso si el rol es válido
            } else {
                return res.status(403).send({
                    message: 'NO ESTA PERMITIDO VISITAR ESTA RUTA'
                });
            }
        } else {
            return res.status(403).send({
                message: 'EL TOKEN NO ES VALIDO'
            });
        }
    };
};

// Exportar middlewares reutilizando createAuth
export default {
    verifyEcommerce: createAuth(['cliente', 'admin']),
    verifyAdmin: createAuth(['admin'])
};