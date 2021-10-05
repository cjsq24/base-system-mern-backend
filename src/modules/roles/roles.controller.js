import { Role, Menu } from '../models'
import { exec } from '../../utils/controllerUtils'

export default {
   list: async (req, res) => {
      exec(res, async () => {
         const params = req.query
         if (Object.keys(params).length > 0) {
            if (params?.name) params.name = { $regex: `.*${params.name}.*`, $options: 'i' }
            if (params?.key_name) params.key_name = { $regex: `.*${params.key_name}.*`, $options: 'i' }
         }
         const values = await Role.find(params)
         res.json({ success: true, values, message: '' })
      })
   },

   create: async (req, res) => {
      exec(res, async () => {
         const errorModules = await checkModules(req.body.modules)

         if (!errorModules) {
            const create = await Role.create({
               name: req.body.name,
               key_name: req.body.key_name,
               modules: JSON.stringify(req.body.modules)
            })

            if (create) {
               res.json({ success: true, values: create, message: 'create_success' })
               return
            }
         }

         res.status(400).json({ success: false, values: {}, message: 'create_failed' })
      })
   },

   update: async (req, res) => {
      exec(res, async () => {
         const errorModules = await checkModules(req.body.modules)

         if (!errorModules) {
            const values = await Role.findByIdAndUpdate(req.params._id, {
               name: req.body.name,
               key_name: req.body.key_name,
               modules: JSON.stringify(req.body.modules)
            }, { new: true })

            if (values) {
               res.json({ success: true, values, message: 'update_success' })
               return
            }
         }
         res.status(400).json({ success: false, values: {}, message: 'update_failed' })
      })
   },

   delete: async (req, res) => {
      exec(res, async () => {
         const values = await Role.findByIdAndRemove(req.params._id)
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
            const values = await Role.findByIdAndUpdate(req.params._id, { status: req.body.status }, { new: true })

            if (values)
               res.json({ success: true, values: {}, message: 'change_status_success' })
            else
               res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
         } else
            res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
      })
   }
}

const checkModules = async (modules) => {
   if (Array.isArray(modules) && modules.length > 0) {
      for (const url of modules) {
         if (!await Menu.findOne({ url }).exec()) return true
      }
   }
   return false;
}