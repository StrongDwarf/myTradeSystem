/**
 * 候选人数据控制器
 * 
 * @author 朱泽聪
 * @createTime 2019-6-12
 * @createReason 项目初始化
 */

require('../models/candidater_model')
const mongoose = require('mongoose')
const Candidater = mongoose.model('Candidater')
const errorType = require('./constants/error_type')
const successType = require('./constants/success_type')

let candidaterController = {
    addOne(obj) {
        Candidater.findOne({
            name: obj.name,
            interviewNumber: obj.interviewNumber
        }).exec((err, doc) => {
            if (err) { console.error(err); return }
            if (doc) { console.log(errorType.DB_ADD_REPEAT_ERROR); return }
            let candidater = new Candidater(obj)
            candidater.save((err, doc) => {
                if (err) { console.log(err); return }
                console.log(successType.DB_SAVE_SUCCESS)
                console.log(doc)
            })
        })

    },
    login(req,res){
        let findObj = {
            name:req.body.name,
            interviewNumber:req.body.interviewNumber
        }
        Candidater.findOne(findObj).exec((err,doc) => {
            if(err){
                console.log(err)
                res.json({
                    error:true,
                    message:errorType.DB_FIND_ERROR
                })
                return
            }
            if(!doc){
                res.json({
                    error:true,
                    message:errorType.DB_NOT_FOUND
                })
                return
            }
            res.json({
                success:true,
                data:{token:'2'}
            })
        })
    }
}

module.exports = candidaterController

