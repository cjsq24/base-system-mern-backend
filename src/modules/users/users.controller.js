import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, Role } from '../models'
import { exec } from '../../utils/controllerUtils'

export default {
   login: async (req, res) => {
      exec(res, async () => {
         const user = await User.findOne({ email: req.body.email }).populate('role_id')
         if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({
               _id: user._id,
               email: user.email,
               modules: user.role_id.modules
            }, process.env.SECRET_TOKEN);

            user.last_login = new Date();
            user.save();

            //delete user._doc.password

            res.json({ success: true, values: { ...user._doc, token }, message: 'login_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'login_failed' })
         }
      })
   },

   list: async (req, res) => {
      exec(res, async () => {
         const params = req.query
         if (Object.keys(params).length > 0) {
            if (params?.name) params.name = { $regex: `.*${params.name}.*`, $options: 'i' }
            if (params?.email) params.email = { $regex: `.*${params.email}.*`, $options: 'i' }
         }
         const values = await User.find(params).populate('role_id')
         res.json({ success: true, values, message: '' })
      })
   },

   create: async (req, res) => {
      exec(res, async () => {
         const password = await bcrypt.hash('1234', 10)
         const create = await User.create({
            ...req.body,
            password: password
         })

         if (create) {
            await create.populate('role_id');
            res.json({ success: true, values: create, message: 'create_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'create_failed' })
         }
      })
   },

   register: async (req, res) => {
      exec(res, async () => {
         const exists = await User.findOne({ email: req.body.email })
         if (!exists) {
            const role = await Role.findOne({ key_name: 'admin' }).exec();
            const password = await bcrypt.hash(req.body.password, 10)
            const values = await User.create({
               name: req.body.name,
               last_name: req.body.last_name,
               email: req.body.email,
               password: password,
               role_id: role._id
            })
            delete values._doc.password

            if (values) {
               res.json({ success: true, values, message: 'user_register_success' })
            } else {
               res.status(400).json({ success: false, values: {}, message: 'user_register_failed' })
            }
         } else {
            res.status(400).json({ success: false, values: {}, message: 'user_exists' })
         }
      })
   },

   update: async (req, res) => {
      exec(res, async () => {
         const update = await User.findByIdAndUpdate(req.params._id, {
            name: req.body.name,
            last_name: req.body.last_name,
            email: req.body.email,
            role_id: req.body.role_id
         }, { new: true })

         if (update) {
            await update.populate('role_id');
            res.json({ success: true, values: update, message: 'update_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'update_failed' })
         }
      })
   },

   delete: async (req, res) => {
      exec(res, async () => {
         const values = await User.findByIdAndRemove(req.params._id)
         if (values) {
            res.json({ success: true, values: {}, message: 'delete_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'delete_failed' })
         }
      })
   },

   changeStatus: async (req, res) => {
      exec(res, async () => {
         if (req.body?.status) {
            const values = await User.findByIdAndUpdate(req.params._id, { status: req.body.status }, { new: true })

            if (values)
               res.json({ success: true, values: {}, message: 'change_status_success' })
            else
               res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
         } else
            res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
      })
   },

   updateProfile: async (req, res) => {
      exec(res, async () => {
         const update = await User.findByIdAndUpdate(req.user_id, {
               name: req.body.name,
               last_name: req.body.last_name,
               email: req.body.email
            }, { new: true }
         )

         if (update) {
            res.json({ success: true, values: {}, message: 'update_profile_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'update_profile_failed' })
         }
      })
   }
}