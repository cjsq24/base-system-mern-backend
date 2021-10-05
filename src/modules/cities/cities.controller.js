import { City } from '../models';
import { exec } from '../../utils/controllerUtils';
import { Types } from 'mongoose'

export default {
   list: async (req, res) => {
      exec(res, async () => {
         const { query } = req
         const params = {}
         if (Object.keys(query).length > 0) {
            if (query?.name) params.name = { $regex: `.*${query.name}.*`, $options: 'i' }
            if (query?.code) params.code = { $regex: `.*${query.code}.*`, $options: 'i' }
            if (query?.state_id) params['state_id._id'] = Types.ObjectId(query.state_id);
            if (query?.country_id && !query?.state_id) 
               params['state_id.country_id._id'] = Types.ObjectId(query.country_id);
         }

         //const values = await City.find(params).populate({ path: 'state', populate: 'country' })
         /*const values = await City.aggregate([
            {
               //$match: params
               $lookup: {
                  from: 'states',
                  localField: 'state_id',
                  foreignField: '_id',
                  as: 'state_id',
               },
            }, {
               $unwind: '$state_id'
            }, {
               $lookup: {
                  from: 'countries',
                  localField: 'state_id.country_id',
                  foreignField: '_id',
                  as: 'state_id.country_id'
               }
            }, {
               $unwind: '$state_id.country_id'
            }, {
               $match: params
            }
         ])*/

         const values = await City.aggregate()
            .lookup({
               from: 'states', //documento al que hacemos referencia
               localField: 'state_id', //
               foreignField: '_id', //clave del documento al que hacemos referencia
               as: 'state_id', //nombre de salida de documento
            })
            .unwind('$state_id') //convertimos a state_id de arreglo a objeto
            .lookup({
               from: 'countries',
               localField: 'state_id.country_id',
               foreignField: '_id',
               as: 'state_id.country_id', //de esta forma hacemos que el país se incruste dentro de state_id, tal como haría el populate
            })
            .unwind('$state_id.country_id')
            .match(params)

         res.json({ success: true, values, message: '' })
      })
   },

   create: async (req, res) => {
      exec(res, async () => {
         const create = await City.create(req.body)
         if (create) {
            await create.populate({ path: 'state_id', populate: 'country_id' })
            res.json({ success: true, values: create, message: 'create_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'create_failed' })
         }
      })
   },

   update: async (req, res) => {
      exec(res, async () => {
         const { name, code, state_id } = req.body;
         const update = await City.findByIdAndUpdate(req.params._id, req.body, { new: true })

         if (update) {
            await update.populate({ path: 'state_id', populate: 'country_id' })
            res.json({ success: true, values: update, message: 'update_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'update_failed' })
         }
      })
   },

   delete: async (req, res) => {
      exec(res, async () => {
         const values = await City.findByIdAndRemove(req.params._id)
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
            const values = await City.findByIdAndUpdate(req.params._id, { status: req.body.status }, { new: true })
            if (values)
               res.json({ success: true, values: {}, message: 'change_status_success' })
            else
               res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
         } else
            res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
      })
   }
}