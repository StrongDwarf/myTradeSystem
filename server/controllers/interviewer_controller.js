/**
 * 面试官数据控制器
 * 
 * @author 朱泽聪
 * @createTime 2019-6-12
 * @createReason 项目初始化
 */

require('../models/interviewer_model')
const mongoose = require('mongoose')
const Interviewer = mongoose.model('Interviewer')
const errorType = require('./constants/error_type')
const successType = require('./constants/success_type')

let interviewerController = {
    addOne(obj) {
        Interviewer.findOne({
            name: obj.name,
            jobNumber: obj.jobNumber
        }).exec((err, doc) => {
            if (err) { console.error(err); return }
            if (doc) { console.log(errorType.DB_ADD_REPEAT_ERROR); return }
            let interviewer = new Interviewer(obj)
            interviewer.save((err, doc) => {
                if (err) { console.log(err); return }
                console.log(successType.DB_SAVE_SUCCESS)
                console.log(doc)
            })
        })
    },
    login(req,res){
        let findObj = {
            name:req.body.name,
            jobNumber:req.body.jobNumber
        }
        Interviewer.findOne(findObj).exec((err,doc) => {
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
                data:{token:'1'}
            })
        })
    }
}

module.exports = interviewerController