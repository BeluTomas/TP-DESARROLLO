import bcrypt from 'bcryptjs';
import models from '../models';
import token from '../services/token';
import resource from '../resources';

export default {
    register: async (req, res) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const user = await models.User.create(req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
        }
    },

    register_admin: async (req, res) => {
        try {
            const userV = await models.User.findOne({ email: req.body.email });
            if (userV) {
                return res.status(500).send({
                    message: "EL USUARIO YA EXISTE"
                });
            }

            req.body.rol = "admin";
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const user = await models.User.create(req.body);
            res.status(200).json({
                user: resource.User.user_list(user)
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
        }
    },

    login: async (req, res) => {
        try {
            const user = await models.User.findOne({ email: req.body.email, state: 1 });
            if (user) {
                const compare = await bcrypt.compare(req.body.password, user.password);
                if (compare) {
                    const tokenT = await token.encode(user._id, user.rol, user.email);
                    const USER_FRONTED = {
                        token: tokenT,
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            surname: user.surname,
                            avatar: user.avatar,
                        },
                    };

                    res.status(200).json({ USER_FRONTED });
                } else {
                    res.status(500).send({
                        message: "EL USUARIO NO EXISTE"
                    });
                }
            } else {
                res.status(500).send({
                    message: "EL USUARIO NO EXISTE"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
        }
    },

    login_admin: async (req, res) => {
        try {
            const user = await models.User.findOne({ email: req.body.email, state: 1, rol: "admin" });
            if (user) {
                const compare = await bcrypt.compare(req.body.password, user.password);
                if (compare) {
                    const tokenT = await token.encode(user._id, user.rol, user.email);
                    const USER_FRONTED = {
                        token: tokenT,
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            surname: user.surname,
                            avatar: user.avatar,
                            rol: user.rol,
                        },
                    };

                    res.status(200).json({ USER_FRONTED });
                } else {
                    res.status(500).send({
                        message: "EL USUARIO NO EXISTE"
                    });
                }
            } else {
                res.status(500).send({
                    message: "EL USUARIO NO EXISTE"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
        }
    },

    update: async (req, res) => {
        try {
            let avatar_name;
            if (req.files) {
                const img_path = req.files.avatar.path;
                const name = img_path.split('\\');
                avatar_name = name[2];
            }
            if (req.body.repet_password) {
                req.body.password = await bcrypt.hash(req.body.repet_password, 10);
            }
            await models.User.findByIdAndUpdate({ _id: req.body._id }, req.body);

            const UserT = await models.User.findOne({ _id: req.body._id });
            res.status(200).json({
                message: "EL USUARIO SE HA MODIFICADO CORRECTAMENTE",
                user: resource.User.user_list(UserT),
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
        }
    },

    list: async (req, res) => {
        try {
            const search = req.query.search;
            let Users = await models.User.find({
                $or: [
                    { "name": new RegExp(search, "i") },
                    { "surname": new RegExp(search, "i") },
                    { "email": new RegExp(search, "i") },
                ]
            }).sort({ 'createdAt': -1 });

            Users = Users.map((user) => resource.User.user_list(user));

            res.status(200).json({ users: Users });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
        }
    },

    remove: async (req, res) => {
        try {
            await models.User.findByIdAndDelete({ _id: req.query._id });
            res.status(200).json({
                message: "EL USUARIO SE ELIMINÓ CORRECTAMENTE",
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIÓ UN PROBLEMA"
            });
        }
    }
};
