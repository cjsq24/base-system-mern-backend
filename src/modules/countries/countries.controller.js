import { Country } from '../models'
import { exec } from '../../utils/controllerUtils'

export default {
   list: async (req, res) => {
      exec(res, async () => {
         const params = req.query
         if (Object.keys(params).length > 0) {
            if (params?.name) params.name = { $regex: `.*${params.name}.*`, $options: 'i' }
            if (params?.code) params.code = { $regex: `.*${params.code}.*`, $options: 'i' }
         }
         const values = await Country.find(params)
         res.json({success: true, values, message: ''})
      })
   },

   create: async (req, res) => {
      exec(res, async () => {
         const values = await Country.create(req.body)
         if (values) {
            res.json({success: true, values, message: 'create_success'})
         } else {
            res.status(400).json({success: false, values: {}, message: 'create_failed'})
         }
      })
   },

   update: async (req, res) => {
      exec(res, async () => {
         const values = await Country.findByIdAndUpdate(req.params._id, req.body, { new: true })
         if (values) {
            res.json({success: true, values, message: 'update_success'})
         } else {
            res.status(400).json({success: false, values: {}, message: 'update_failed'})
         }
      })
   },

   delete: async (req, res) => {
      exec(res, async () => {
         const values = await Country.findByIdAndRemove(req.params._id)
         if (values) {
            res.json({success: true, values: {}, message: 'delete_success'})
         } else {
            res.status(400).json({success: false, values: {}, message: 'delete_failed'})
         }
      })
   },

   changeStatus: async (req, res) => {
      exec(res, async () => {
         if (req.body?.status) {
            const values = await Country.findByIdAndUpdate(req.params._id, { status: req.body.status }, {new: true})

            if (values)
               res.json({ success: true, values: {}, message: 'change_status_success' })
            else
               res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
         } else
            res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
      })
   }
}